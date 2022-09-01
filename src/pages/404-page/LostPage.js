import React from 'react';
import LlamaSVG from '../../assets/llama.svg';
import { Helmet } from 'react-helmet';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const LostPage = () => {
	let navigate = useNavigate();

	const backBtn = () => {
    try {
      navigate('../');
    } catch (e) {
      console.log(e);
    }
  }

	// styles
	const title = {color: "black", fontFamily: "Courier New", fontSize: 30, fontWeight: 300};
	const btnText = {color: "white", fontFamily: "Courier New", fontSize: 20, fontWeight: 300, 
	backgroundColor: 'black', border: '0px', maxHeight: 70};


	return(
		<div className='row mt-5 d-flex justify-content-center'>
			<Helmet>
				<style>{"body {background-color: #FFA85C; overflow-x: hidden}"}</style>
			</Helmet>
			<div className='row m-5 p-5'>
				{/* eslint-disable-next-line */}
				<div className='col-6'><img src={LlamaSVG} width='200'></img><br/></div>
				<div className='col-6'><h1 className='mt-2' style={title}>lost?</h1>
					<Button onClick={backBtn} style={btnText}>this way!</Button></div>
			</div>
		</div>
	) 
}

export default LostPage;