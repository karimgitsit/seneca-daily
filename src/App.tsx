import { HashRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ReadingView from './screens/ReadingView'
import LetterIndex from './screens/LetterIndex'
import HighlightsView from './screens/HighlightsView'
import Settings from './screens/Settings'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<ReadingView />} />
          <Route path="/index" element={<LetterIndex />} />
          <Route path="/highlights" element={<HighlightsView />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
