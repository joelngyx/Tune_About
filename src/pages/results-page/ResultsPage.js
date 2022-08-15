import React, { Fragment, useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';
import Lyrics from './Lyrics';
import Album from './Album';
import Posts from './Posts';
import { motion } from 'framer-motion';

let albumArt = require('album-art');
let musicInfo = require('music-info');

const ResultsPage = () => {
  let {state} = useLocation();
  console.log(state);

  const [artist, setArtist] = useState(state.artist);
  const [song, setSong] = useState(state.song);

  return(
    <motion.div
      initial={{width: 0}}
      animate={{width: '100%'}}
      exit={{x: '100%'}}>
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
          <Posts artist={artist} song={song}/>
        </div>
      </div>
    </motion.div>
  )
}

export default ResultsPage;