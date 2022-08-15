import React, { Fragment, useEffect, useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Lyrics from './Lyrics';
import Album from './Album';
import Posts from './Posts';
import { motion } from 'framer-motion';
import Button from 'react-bootstrap/Button';

let albumArt = require('album-art');
let musicInfo = require('music-info');

const ResultsPage = () => {
  let {state} = useLocation();
  console.log(state);
  let navigate = useNavigate();

  const [artist, setArtist] = useState('');
  const [song, setSong] = useState('');
  const [attempt, setAttempt] = useState(0);

  const backBtn = () => {
    try {
      navigate('../');
    } catch (e) {
      console.log(e);
    }
  }

  const getState = () => {
    try {
      setArtist(state.artist);
      setSong(state.song);
    } catch (e) {
      console.log(e);
    }
  }

  const incrementAttempt = () => {
    if (artist === '' || song === '') {
      setAttempt(attempt + 1)
    }
  }

  useEffect(() => {
    setTimeout(getState, 100);
    setTimeout(incrementAttempt, 110);
  }, [attempt])

  if (song === ''|| artist === '') {
    return <h1>loading</h1>
  } else {
    return(
      <motion.div initial={{width: 0}} animate={{width: '100%'}} exit={{x: '100%'}}>
        <div className='row'>
          <div className='col-12 col-md-4'>
            <div className='container mt-5 p-5' style={{border: '1px solid'}}>
              <Album artist={artist} song={song}/>
              <div className='container p-0 mt-5' 
                style={{border: '1px solid'}}>
                <Lyrics artist={artist} song={song}/>
              </div>
            </div>
          </div>
          <div className='col-12 col-md-8'>
            <Button onClick={() => {
              backBtn();
            }}>Look up another song</Button>
            <Posts artist={artist} song={song}/>
          </div>
        </div>
      </motion.div>
    )
  }
}

export default ResultsPage;