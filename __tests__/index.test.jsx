import React from 'react';
import {render, screen} from "@testing-library/react";
import Home from '../src/pages/index.js'

describe("Home page", ()=>{

it("renders select list", ()=>{
    render(<Home />);
    screen.getByText('short');
})
})