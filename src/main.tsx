import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App.tsx'
import './scss/index.scss'
import { IntlProvider } from 'react-intl'
import translation_ru from './localization/ru/compiled-lang/ru.json'
import translation_de from './localization/de/de.json' // haven't compiled yet

const messages: any = {
  'ru': translation_ru,
  'de': translation_de
};

// get browser language without the region code
const language: string = navigator.language.split(/[-_]/)[0];
// const language = "fr";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <IntlProvider
      locale={navigator.language}
      messages={messages[language]}
    >
      <Router>
        <App />
      </Router>
    </IntlProvider>
  </React.StrictMode>,
)
