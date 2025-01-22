import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import {MantineProvider} from "@mantine/core"

import Home from './screens/home'

import './index.css'

const paths=[
  {
    path:'/',
    element:(
      <Home/>
    ),
  },
];

const BroswerRouter=createBrowserRouter(paths);
const App=()=>{
  return (
    <MantineProvider>
      <RouterProvider router={BroswerRouter}/>

    </MantineProvider>
  )
}

export default App;