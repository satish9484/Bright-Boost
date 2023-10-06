import React from 'react'
import { useParams, Link } from "react-router-dom";

const EditSessionQA = () => {
    const { id } = useParams()
    console.log(id);
  return (
    <>
        <div>Edit SessionQA</div>
        <div>QA ID: {id}</div>
    </>
  )
}

export default EditSessionQA