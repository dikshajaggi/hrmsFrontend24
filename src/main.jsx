import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { MsalProvider } from '@azure/msal-react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { msalInstance } from './apis/msalInstance'

const queryClient = new QueryClient();


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MsalProvider instance={msalInstance}>
       <App />
     </MsalProvider>
    </QueryClientProvider>
  </StrictMode>,
)
