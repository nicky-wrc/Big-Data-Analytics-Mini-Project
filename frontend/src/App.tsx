import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Overview from './pages/Overview'
import Transactions from './pages/Transactions'
import Analytics from './pages/Analytics'
import ModelInsights from './pages/ModelInsights'
import Predict from './pages/Predict'
import ApiDocs from './pages/ApiDocs'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/model" element={<ModelInsights />} />
        <Route path="/predict" element={<Predict />} />
        <Route path="/api-docs" element={<ApiDocs />} />
      </Routes>
    </Layout>
  )
}

export default App
