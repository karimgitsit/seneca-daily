#!/usr/bin/env python3
"""
Validate the scraped letters.json file.
Exits non-zero if any check fails.
"""

import json
import os
import re
import sys

LETTERS_PATH = os.path.join(os.path.dirname(__file__), "..", "public", "data", "letters.json")
TOTAL_EXPECTED = 124

HTML_TAG_RE = re.compile(r"<[^>]+>")
NAV_ARTIFACTS = [
    "← Letter",
    "Letter →",
    "Wikisource",
    "Creative Commons",
    "This work is",
    "Public domain",
]


def validate():
    errors = []
    warnings = []

    # 1. File exists and is valid JSON
    if not os.path.exists(LETTERS_PATH):
        print(f"FAIL: {LETTERS_PATH} does not exist")
        sys.exit(1)

    try:
        with open(LETTERS_PATH, "r", encoding="utf-8") as f:
            letters = json.load(f)
    except json.JSONDecodeError as e:
        print(f"FAIL: Invalid JSON - {e}")
        sys.exit(1)

    # 2. Array length is exactly 124
    if len(letters) != TOTAL_EXPECTED:
        errors.append(f"Expected {TOTAL_EXPECTED} letters, got {len(letters)}")

    # 3. Check each letter
    numbers_seen = set()
    total_paragraphs = 0
    min_paragraphs = float("inf")
    max_paragraphs = 0

    for letter in letters:
        n = letter.get("number")
        title = letter.get("title", "")
        paragraphs = letter.get("paragraphs", [])

        # Number checks
        if n is None:
            errors.append("Letter missing 'number' field")
            continue

        if n in numbers_seen:
            errors.append(f"Duplicate letter number: {n}")
        numbers_seen.add(n)

        # Title checks
        if not title or not title.strip():
            errors.append(f"Letter {n}: empty title")
        if HTML_TAG_RE.search(title):
            errors.append(f"Letter {n}: HTML in title: {title[:80]}")

        # Paragraphs checks
        if not paragraphs:
            errors.append(f"Letter {n}: no paragraphs")
            continue

        total_paragraphs += len(paragraphs)
        min_paragraphs = min(min_paragraphs, len(paragraphs))
        max_paragraphs = max(max_paragraphs, len(paragraphs))

        for i, p in enumerate(paragraphs):
            if not p or not p.strip():
                errors.append(f"Letter {n}, paragraph {i}: empty")
            if HTML_TAG_RE.search(p):
                errors.append(f"Letter {n}, paragraph {i}: contains HTML tags: {p[:80]}...")
            for artifact in NAV_ARTIFACTS:
                if artifact.lower() in p.lower():
                    errors.append(
                        f"Letter {n}, paragraph {i}: contains navigation artifact '{artifact}': {p[:80]}..."
                    )

        # Warn if suspiciously few paragraphs
        if len(paragraphs) < 3:
            warnings.append(f"Letter {n}: only {len(paragraphs)} paragraphs (might be incomplete)")

    # 4. Check for gaps in numbering
    expected_numbers = set(range(1, TOTAL_EXPECTED + 1))
    missing = expected_numbers - numbers_seen
    if missing:
        errors.append(f"Missing letter numbers: {sorted(missing)}")

    # Print summary
    print(f"Letters: {len(letters)}")
    print(f"Total paragraphs: {total_paragraphs}")
    if letters:
        print(f"Paragraphs per letter: min={min_paragraphs}, max={max_paragraphs}, avg={total_paragraphs/len(letters):.1f}")
    print()

    if warnings:
        print(f"WARNINGS ({len(warnings)}):")
        for w in warnings:
            print(f"  - {w}")
        print()

    if errors:
        print(f"ERRORS ({len(errors)}):")
        for e in errors:
            print(f"  - {e}")
        print()
        print("VALIDATION FAILED")
        sys.exit(1)
    else:
        print("VALIDATION PASSED")


if __name__ == "__main__":
    validate()
