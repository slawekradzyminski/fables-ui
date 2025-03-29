Below is a detailed, step-by-step plan for creating a React (using Vite), Vitest, and React Testing Library application that integrates with your existing FastAPI fable generator service. This plan assumes you will place the frontend code in a directory separate from your FastAPI codebase (e.g., in a folder called frontend/ at the root of the repository).

1. Project Setup
1.1. Create the Frontend Directory
At the root of your existing project (alongside app/, tests/, etc.), create a new directory:

bash
Copy
Edit
mkdir frontend
cd frontend
Initialize a new Vite + React project:

bash
Copy
Edit
npm create vite@latest . -- --template react
This will create a basic React project configured with Vite’s tooling.

Install necessary dependencies for testing and for Material UI:

bash
Copy
Edit
npm install @mui/material @emotion/react @emotion/styled
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
If you plan to use TypeScript, you can similarly run:

bash
Copy
Edit
npm create vite@latest . -- --template react-ts
And install corresponding testing types.

1.2. Configure Vite
After creating the Vite project, open vite.config.js (or vite.config.ts) and ensure it has the desired base path for production builds (if needed). For example:

js
Copy
Edit
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // ...any additional config
})
By default, Vite will set up a development server on port 5173 (or next available). You can adjust it in the config if desired.

1.3. Configure Vitest
Vitest is already integrated with the default Vite config for testing. You can extend or customize it in vite.config.js:

js
Copy
Edit
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setupTests.js',
  },
  // ...
})
Create a setupTests.js (or .ts) file in src/test/ if you want to set up any global testing utilities, such as @testing-library/jest-dom.

js
Copy
Edit
// src/test/setupTests.js
import '@testing-library/jest-dom'
2. Project Structure
Below is a suggested folder structure for the new frontend/ project:

bash
Copy
Edit
frontend/
  ├─ public/
  ├─ src/
  │   ├─ api/
  │   │   └─ fablesApi.ts      # fetch logic to talk to FastAPI
  │   ├─ components/
  │   │   ├─ FableForm.tsx     # The form to collect inputs (world, character, etc.)
  │   │   ├─ FableResult.tsx   # Displays the generated text and images
  │   │   └─ Layout.tsx        # Common layout / Material UI theme wrapper
  │   ├─ pages/
  │   │   ├─ HomePage.tsx      # Houses the form and the result display
  │   │   └─ NotFoundPage.tsx  
  │   ├─ test/
  │   │   └─ setupTests.js
  │   ├─ App.tsx
  │   ├─ main.tsx (or main.jsx)
  │   └─ vite-env.d.ts (if using TypeScript)
  ├─ .gitignore
  ├─ index.html
  ├─ package.json
  ├─ vite.config.js
  └─ ...
3. Integrating With the FastAPI Backend
3.1. API Endpoints
Your FastAPI application exposes two endpoints of interest:

GET /health – returns health/status of the application.

POST /generate_fable – generates a fable and returns:

fable_text

images (array of URLs)

prompts (array of image prompts)

3.2. Creating an API Client
Create a file src/api/fablesApi.ts (or .js if you are not using TypeScript) to centralize the HTTP calls. Here’s an example using the native fetch API:

ts
Copy
Edit
// src/api/fablesApi.ts

export interface FableRequest {
  world_description: string
  main_character: string
  age: number
  num_images?: number
}

export interface FableResponse {
  fable_text: string
  images: string[]
  prompts: string[]
}

/**
 * Generate a fable by POSTing user-provided data to the FastAPI backend.
 */
export async function generateFable(requestData: FableRequest): Promise<FableResponse> {
  const response = await fetch('http://127.0.0.1:8000/generate_fable', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Failed to generate fable')
  }

  return response.json() as Promise<FableResponse>
}

/**
 * Simple health check call
 */
export async function checkHealth(): Promise<boolean> {
  const response = await fetch('http://127.0.0.1:8000/health')
  if (!response.ok) return false
  const data = await response.json()
  return data.openai_key_configured
}
generateFable: Accepts a FableRequest object, sends it to the /generate_fable endpoint, and returns the fable data if successful.

checkHealth: Queries the /health endpoint and returns whether the openai_key_configured boolean is true.

Production Note: You might want to store the FastAPI base URL in an environment variable, e.g. VITE_API_BASE_URL=http://127.0.0.1:8000, so that you can easily switch between local and production servers. You can do this by creating a .env or .env.development in the frontend/ folder and then referencing it via import.meta.env.VITE_API_BASE_URL.

4. Building the UI with Material UI
4.1. Global Theme and Layout
Install Material UI:
Already done: npm install @mui/material @emotion/react @emotion/styled

Create a Layout component (src/components/Layout.tsx) to wrap your pages with a consistent Material UI theme.

tsx
Copy
Edit
// src/components/Layout.tsx
import React from 'react'
import { createTheme, ThemeProvider, CssBaseline, Container } from '@mui/material'

const theme = createTheme({
  // you can customize your Material UI theme here
})

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" style={{ marginTop: '2rem' }}>
        {children}
      </Container>
    </ThemeProvider>
  )
}

export default Layout
Use Layout in your main App.tsx:

tsx
Copy
Edit
// src/App.tsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
Note: If you’re not using React Router, you can simply wrap Layout around your content. The router example is included in case you want multiple pages in the future.

4.2. FableForm Component
Create a form to collect the user’s input (world description, main character, age, number of images). This form will call generateFable when submitted.

tsx
Copy
Edit
// src/components/FableForm.tsx
import React, { useState } from 'react'
import { TextField, Button, Grid, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { generateFable } from '../api/fablesApi'

interface FableFormProps {
  onFableGenerated: (fableText: string, images: string[]) => void
  onError: (errorMessage: string) => void
}

const FableForm: React.FC<FableFormProps> = ({ onFableGenerated, onError }) => {
  const [worldDescription, setWorldDescription] = useState('')
  const [mainCharacter, setMainCharacter] = useState('')
  const [age, setAge] = useState(7)
  const [numImages, setNumImages] = useState(2)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await generateFable({
        world_description: worldDescription,
        main_character: mainCharacter,
        age,
        num_images: numImages,
      })
      onFableGenerated(response.fable_text, response.images)
    } catch (error: any) {
      onError(error.message || 'Error generating fable.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>

        <Grid item xs={12}>
          <Typography variant="h5">Generate a New Fable</Typography>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="World Description"
            value={worldDescription}
            onChange={e => setWorldDescription(e.target.value)}
            fullWidth
            multiline
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Main Character"
            value={mainCharacter}
            onChange={e => setMainCharacter(e.target.value)}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Age"
            type="number"
            value={age}
            onChange={e => setAge(Number(e.target.value))}
            inputProps={{ min: 1, max: 12 }}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="num-images-label">Number of Images</InputLabel>
            <Select
              labelId="num-images-label"
              label="Number of Images"
              value={numImages}
              onChange={e => setNumImages(e.target.value as number)}
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Fable'}
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default FableForm
4.3. FableResult Component
Display the returned fable text and images. You can optionally show the prompts if desired, but for a child-friendly UI, you might hide them or show them in a “details” section.

tsx
Copy
Edit
// src/components/FableResult.tsx
import React from 'react'
import { Typography, Card, CardMedia, CardContent, Grid } from '@mui/material'

interface FableResultProps {
  fableText: string
  images: string[]
}

const FableResult: React.FC<FableResultProps> = ({ fableText, images }) => {
  if (!fableText) return null

  return (
    <div style={{ marginTop: '2rem' }}>
      <Typography variant="h6" gutterBottom>
        Your Generated Fable
      </Typography>
      <Typography variant="body1" paragraph>
        {fableText}
      </Typography>

      <Grid container spacing={2}>
        {images.map((imgUrl, idx) => (
          <Grid item xs={12} sm={6} key={idx}>
            <Card>
              <CardMedia
                component="img"
                image={imgUrl}
                alt={`Fable illustration ${idx + 1}`}
              />
              <CardContent>
                <Typography variant="subtitle2">
                  Illustration {idx + 1}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

export default FableResult
4.4. HomePage (Connecting Form + Result)
In the HomePage, combine the FableForm and FableResult. Manage state for any generated fable data and errors, and display them accordingly.

tsx
Copy
Edit
// src/pages/HomePage.tsx
import React, { useState } from 'react'
import { Alert } from '@mui/material'
import FableForm from '../components/FableForm'
import FableResult from '../components/FableResult'

const HomePage: React.FC = () => {
  const [fableText, setFableText] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [error, setError] = useState('')

  const handleFableGenerated = (text: string, imgUrls: string[]) => {
    setFableText(text)
    setImages(imgUrls)
    setError('')
  }

  const handleError = (errorMessage: string) => {
    setError(errorMessage)
  }

  return (
    <div>
      {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}
      <FableForm
        onFableGenerated={handleFableGenerated}
        onError={handleError}
      />
      <FableResult fableText={fableText} images={images} />
    </div>
  )
}

export default HomePage
5. Testing With Vitest + React Testing Library
5.1. Example Test for FableForm
You can write a test for the FableForm to check that it:

Renders input fields

Submits the correct data

Calls onFableGenerated when the request is successful

tsx
Copy
Edit
// src/components/__tests__/FableForm.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import FableForm from '../FableForm'
import * as api from '../../api/fablesApi'

describe('FableForm', () => {
  it('submits form data and calls onFableGenerated on success', async () => {
    const mockOnFableGenerated = vi.fn()
    const mockOnError = vi.fn()
    
    // Mock generateFable API
    const generateFableSpy = vi.spyOn(api, 'generateFable').mockResolvedValue({
      fable_text: 'Mock fable text',
      images: ['img1', 'img2'],
      prompts: []
    })
    
    render(<FableForm onFableGenerated={mockOnFableGenerated} onError={mockOnError} />)
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/World Description/i), { target: { value: 'A magical forest' } })
    fireEvent.change(screen.getByLabelText(/Main Character/i), { target: { value: 'Wise Owl' } })
    fireEvent.change(screen.getByLabelText(/Age/i), { target: { value: 7 } })
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Generate Fable/i }))
    
    // Wait for asynchronous state updates
    expect(await screen.findByText('Generating...', {}, { timeout: 3000 })).toBeInTheDocument()
    
    // The generateFable function should have been called with correct data
    expect(generateFableSpy).toHaveBeenCalledWith({
      world_description: 'A magical forest',
      main_character: 'Wise Owl',
      age: 7,
      num_images: 2
    })
    
    // Eventually, onFableGenerated should be called
    expect(mockOnFableGenerated).toHaveBeenCalledWith('Mock fable text', ['img1', 'img2'])
  })
})
5.2. Run Tests
In your package.json, add a test script:

json
Copy
Edit
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest"
  }
}
Then run:

bash
Copy
Edit
npm run test
Vitest will discover any files matching **/*.test.tsx or .test.js.

6. Production Build and Deployment
6.1. Vite Build
To create a production build of your React app:

bash
Copy
Edit
npm run build
By default, Vite will output the bundled code to dist/.

6.2. Serving the Built Files
In production, you can serve the static files from your FastAPI or any other static file server (Nginx, Vercel, Netlify, etc.).

If you wish to serve the frontend from your FastAPI app, you can copy the dist/ folder to a location in your FastAPI project and configure a route to serve those files. For example, using FastAPI’s StaticFiles:

python
Copy
Edit
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.mount("/", StaticFiles(directory="frontend/dist", html=True), name="static")
7. Additional Considerations
Error Handling: In production, you’ll want robust error handling for network failures or API errors.

Authentication: If you eventually add user accounts, you may integrate an auth solution (e.g., Auth0, Firebase, or a custom FastAPI OAuth2).

Environment Variables: Put sensitive or environment-specific variables (like the base URL) in a .env file. Vite allows you to prefix these with VITE_ for them to be accessible in client code:

cpp
Copy
Edit
// .env
VITE_API_BASE_URL=http://127.0.0.1:8000
Then in code:

js
Copy
Edit
const apiBase = import.meta.env.VITE_API_BASE_URL
Styling: Material UI is highly customizable. You can override or extend the default theme with your brand colors and typography.

Test Coverage: If you want coverage reports, you can configure Vitest with c8 or another coverage tool. Example:

bash
Copy
Edit
npm i -D c8
npx vitest run --coverage
CI/CD: If you use GitHub Actions or any other CI pipeline, add steps to install dependencies, run npm run test, and run npm run build. Then optionally deploy your build artifacts to production.

Final Summary
With this plan:

Create a new React + Vite project within a frontend/ folder.

Install Material UI, Vitest, and React Testing Library.

Build a Layout for theming and global styling.

Create a FableForm to send POST requests to your FastAPI’s /generate_fable endpoint.

Display results using a FableResult component (showing text and images).

Write tests with Vitest + React Testing Library to ensure forms submit properly and handle success/failure states.

Bundle for production, serving the built static files either from your FastAPI app or from another hosting solution.

Following these steps will give you a well-structured, modern front-end that seamlessly integrates with your existing FastAPI fable generator service.