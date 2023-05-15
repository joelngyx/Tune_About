import React, { useState, useEffect } from "react";

import NavBar from "../../shared/navbar/";
import InformationTab from "./tabs/information";
import RedditPostsTab from "./tabs/reddit-posts";

import LlamaSVG from "./assets/llama.svg";
import "./style.scss";


const ResultSection = (props) => {
  /* State to navigate between Information tab and Reddit Posts tab */
  const [currentTab, setCurrentTab] = useState(0);
  const [dataObject, setDataObject] = useState();
  const [isResultEmpty, setIsResultEmpty] = useState(true);
  const [album, setAlbum] = useState();
  const [hasWaited, setHasWaited] = useState();

  

  /* Check if there are search results */
  const getSearchResults = () => {
    let queryArtist = props.artistName;
    let querySong = props.songName;
    let searchString = `https://itunes.apple.com/search?term=${querySong}+${queryArtist}&limit=75&entity=song`;
    
    fetch(
      searchString
    ).then(
      (res) => {
        if (!res.ok) {
          throw new Error("Error fetching from iTunes");
        } else {
          return res.json();
        }
      }
    ).then(
      (data) => {
        if (data !== undefined && data !== null) {
          if (data.resultCount > 0) {
            setIsResultEmpty(false);
            setDataObject(data);
          } else if (data.resultCount === 0) {
            throw new Error("Error fetching from iTunes");
          }
        }
      }
    ).catch((e) => {
      setIsResultEmpty(true)
    })
  }



  /* On component mount */
  useEffect(() => {
    getSearchResults();
    setTimeout(() => {
      setHasWaited(true);
    }, 7000);
    // eslint-disable-next-line
  }, [])


  
  return (
    <div className="results">
      {(!isResultEmpty) 
        ? <NavBar setSection={props.setSection}
            setCurrentTab={setCurrentTab}/>
        : <></>}
      {(!isResultEmpty) 
        ? <div className="results-container">
            {(currentTab === 0) 
              ? <InformationTab songName={props.songName}
                  setSongName={props.setSongName}
                  artistName={props.artistName}
                  setArtistName={props.setArtistName}
                  dataObject={dataObject}
                  setAlbum={setAlbum}/> 
              : <RedditPostsTab songName={props.songName}
                  artistName={props.artistName}
                  album={album}/>}
          </div>
        : <div className="results-error">
            <img alt="error llama" src={LlamaSVG}></img>
            {(!hasWaited)
              ?
                <>
                  <h2>Loading...</h2>
                  <p>Fetching data from places...</p>
                </>
              : <>
                  <h2>Nothing found</h2>
                  <p>This could be due to an incorrect spelling. Try making another search!</p>
                </>}
            <button onClick={() => {props.setSection(0)}}>Back</button>
          </div>
      }
    </div>
  )
}

export default ResultSection;