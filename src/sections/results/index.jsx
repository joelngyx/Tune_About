import React, { useState, useEffect } from "react";

import NavBar from "../../shared/navbar/";
import InformationTab from "./tabs/information";
import RedditPostsTab from "./tabs/reddit-posts";

import "./style.scss";


const ResultSection = (props) => {
  /* State to navigate between Information tab and Reddit Posts tab */
  const [currentTab, setCurrentTab] = useState(0);
  const [dataObject, setDataObject] = useState();
  const [isResultEmpty, setIsResultEmpty] = useState(true);


  /* Check if there are search results */
  const getSearchResults = () => {
    let queryArtist = props.artistName;
    let querySong = props.songName;
    let searchString = `https://itunes.apple.com/search?term=${querySong}+${queryArtist}&limit=25&entity=song`;
    
    fetch(
      searchString
    ).then(
      (res) => {
        return res.json();
      }
    ).then(
      (data) => {
        if (data !== undefined && data !== null) {
          if (data.resultCount > 0) {
            setIsResultEmpty(false);
            setDataObject(data);
          }
        }
      }
    )
  }

  useEffect(() => {
    getSearchResults();
  }, [])


  return (
    <div className="results">
      <NavBar setSection={props.setSection}
        setCurrentTab={setCurrentTab}/>
      {(!isResultEmpty) 
        ? <div className="info-container">
            {(currentTab === 0) 
              ? <InformationTab songName={props.songName}
                  setSongName={props.setSongName}
                  artistName={props.artistName}
                  setArtistName={props.setArtistName}
                  dataObject={dataObject}/> 
              : <RedditPostsTab songName={props.songName}
                  artistName={props.artistName}/>}
          </div>
        : <>Nothing found</>
      }
      
    </div>
  )
}

export default ResultSection;