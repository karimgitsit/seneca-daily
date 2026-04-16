#!/usr/bin/env python3
"""
Scrape all 124 of Seneca's Moral Letters to Lucilius from Wikisource.
Outputs public/data/letters.json with paragraph-level structure.
"""

import json
import os
import re
import sys
import time

import requests
from bs4 import BeautifulSoup, NavigableString

BASE_URL = "https://en.wikisource.org/wiki/Moral_letters_to_Lucilius/Letter_{n}"
OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "..", "public", "data", "letters.json")
TOTAL_LETTERS = 124
SESSION = requests.Session()
SESSION.headers.update({
    "User-Agent": "SenecaDailyBot/1.0 (personal reading app; one-time scrape)"
})


def clean_text(text: str) -> str:
    """Clean extracted text: normalize whitespace."""
    text = text.strip()
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def extract_title(content) -> str:
    """Extract the letter title from centered header blocks."""
    centers = content.select("div.wst-center")
    for center in centers:
        text = center.get_text(strip=True)
        # Skip the "THE EPISTLES OF SENECA" header
        if "EPISTLES OF SENECA" in text.upper():
            continue
        # Skip greetings
        if text.lower().startswith("greetings from") or text.lower().startswith("seneca greets"):
            continue
        # Skip "Farewell"
        if text.lower().startswith("farewell"):
            continue
        # Match pattern like "I. ON SAVING TIME" or "XLII. ON VALUES"
        match = re.match(r"^([IVXLCDM]+)\.\s*(.+)$", text, re.IGNORECASE)
        if match:
            title = match.group(2).strip()
        else:
            # Some letters lack the numeral prefix — take the whole text as title
            title = text.strip()
        # Remove footnote references like [1], [2]
        title = re.sub(r"\[\d+\]", "", title).strip()
        # Convert ALL CAPS to Title Case
        if title == title.upper() and len(title) > 3:
            title = title.title()
        if title:
            return title
    return ""


def is_wst_center_ancestor(tag, content_root) -> bool:
    """Check if any ancestor (up to content_root) has class wst-center."""
    node = tag.parent
    while node and node != content_root:
        if node.get("class") and "wst-center" in node.get("class", []):
            return True
        node = node.parent
    return False


def clean_paragraph(p_tag) -> str:
    """Extract clean text from a <p> tag, removing footnotes, section numbers, page markers, and styles."""
    import copy
    # Work on a deep copy so we don't mutate the original tree
    p = copy.copy(p_tag)

    # Remove elements we don't want
    for unwanted in p.select("sup, style"):
        unwanted.decompose()

    # Remove section number markers (e.g. <span class="wst-verse" id="1."><sup><b>1.</b></sup></span>)
    for span in p.select("span.wst-verse"):
        span.decompose()

    # Remove page number markers
    for span in p.select("span.pagenum"):
        span.decompose()

    text = p.get_text()
    # Remove any remaining leading section numbers like "1." or "12."
    text = re.sub(r"^\d{1,3}\.\s*", "", text.strip())
    return clean_text(text)


def extract_paragraphs(content) -> list[str]:
    """Extract body paragraphs from the prp-pages-output div."""
    paragraphs = []

    # Walk through all <p> tags recursively (they may be nested inside <link> elements)
    for p_tag in content.find_all("p", recursive=True):
        # Skip paragraphs inside wst-center blocks (titles, volume headers)
        if is_wst_center_ancestor(p_tag, content):
            text = clean_text(p_tag.get_text())
            # The greeting "Greetings from Seneca..." is part of the letter body
            if text.startswith("Greetings from Seneca") or text.startswith("Seneca greets"):
                paragraphs.append(text)
            # Some letters have "Farewell" as a centered block
            elif text.lower().startswith("farewell"):
                paragraphs.append(text)
            continue

        text = clean_paragraph(p_tag)

        if not text:
            continue

        # Skip navigation text
        if re.match(r"^←|→$", text):
            continue

        # Skip zero-width space only paragraphs
        if text.strip() in ("", "\u200b", "​"):
            continue

        paragraphs.append(text)

    return paragraphs


def scrape_letter(n: int) -> dict:
    """Scrape a single letter and return its data."""
    url = BASE_URL.format(n=n)
    print(f"  Fetching Letter {n}... ", end="", flush=True)

    resp = SESSION.get(url, timeout=30)
    resp.raise_for_status()

    soup = BeautifulSoup(resp.text, "html.parser")

    # Content lives inside div.prp-pages-output
    content = soup.select_one("div.prp-pages-output")
    if not content:
        # Fallback to mw-parser-output
        content = soup.select_one("div.mw-parser-output")

    if not content:
        raise ValueError("Could not find content container")

    title = extract_title(content)
    paragraphs = extract_paragraphs(content)

    print(f"'{title}' - {len(paragraphs)} paragraphs")

    return {
        "number": n,
        "title": title,
        "paragraphs": paragraphs,
    }


def main():
    print(f"Scraping {TOTAL_LETTERS} letters from Wikisource...\n")

    letters = []
    failures = []

    for n in range(1, TOTAL_LETTERS + 1):
        success = False
        for attempt in range(3):
            try:
                letter = scrape_letter(n)
                letters.append(letter)
                success = True
                break
            except Exception as e:
                print(f"  FAILED (attempt {attempt + 1}): {e}")
                if attempt < 2:
                    time.sleep(3)
        if not success:
            failures.append(n)

        # Be polite: wait between requests
        if n < TOTAL_LETTERS:
            time.sleep(1)

    if failures:
        print(f"\nFAILED to scrape letters: {failures}")
        sys.exit(1)

    # Ensure output directory exists
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(letters, f, ensure_ascii=False, indent=2)

    print(f"\nDone! Wrote {len(letters)} letters to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
