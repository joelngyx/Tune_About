import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/logo.svg';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const [artist, setArtist] = useState("");
  const [song, setSong] = useState("");
  const [error, setError] = useState("");

  let navigate = useNavigate();

  const onSubmitForm = (event) => {
    event.preventDefault();
    if(artist === '' || song === '') {
      setError('fields cannot be empty!')
    } else {
      navigate('/results', {state: {artist: artist, song: song}});
    }
  }

  // to remove error message dynamically
  useEffect(() => {
    setError('');
  }, [artist, song]);

  // styles
  const title = {color: "black", fontFamily: "Courier New", fontSize: 50, fontWeight: 300};
  const fieldText = {color: "black", fontFamily: "Courier New", fontSize: 20, fontWeight: 200};
  const submitText = {color: "#F08756", fontFamily: "Courier New", fontSize: 20, fontWeight: 300, backgroundColor: "black", border: 'none'};

  return (
    <motion.div 
      initial={{x: 0, opacity: 0}}
      animate = {{opacity: 1, transition:{duration: 0.5}}}
      exit={{opacity: 0 }}>
      <Helmet>
        <style>{"body {background-color: #FFA85C; overflow-x: hidden}"}</style>
      </Helmet>
      <div className='container mt-5 px-0'>
        <div className='row d-flex justify-content-center'>
          {/* eslint-disable-next-line */}
          <img src={Logo} width='350' height='200'/>
        </div>
        <div className='row d-flex justify-content-center'>
          <h1 style={title}>tune-about</h1>
        </div>
        <div className='row d-flex justify-content-center'>
          <p style={fieldText}>provide a song's name and artist, and this web app <br/> 
          will return relevant information about it</p>
        </div>
        <div className='row justify-content-center'>
          <form className='mt-3' onSubmit={onSubmitForm}>
            <input type='text' value={artist} className='form-control mt-1' placeholder='enter artist name' style={fieldText}
              onChange={e => setArtist(e.target.value)}/>
            <input type='text' value={song} className='form-control mt-2' placeholder='enter song name' style={fieldText}
              onChange={e => setSong(e.target.value)}/> 
            <input type='submit' className='form-control mt-3' value='search' style={submitText}/>
          </form>
        </div>
        <div className='row d-flex justify-content-center'>
          <p>{error}</p>
        </div>
      </div>
  </motion.div>
  )
}

export default LandingPage;