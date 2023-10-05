import React from 'react'
import { useLocation, Link } from "react-router-dom";

const EditSessionQA = () => {
    const { state } = useLocation();
  return (
    <>
        <div>Edit SessionQA</div>
        <div>{state.id}</div>
    </>
  )
}

export default EditSessionQA