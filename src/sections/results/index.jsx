import React, { useState } from "react";

import NavBar from "../../shared/navbar/";
import InformationTab from "./tabs/information";
import RedditPostsTab from "./tabs/reddit-posts";

import "./style.scss";


const ResultSection = (props) => {
  /* State to navigate between Song information and Relevant Posts on Reddit */
  const [currentTab, setCurrentTab] = useState(0);

  /* Fetches Lyrics */

  return (
    <div className="results">
      <NavBar setSection={props.setSection}
        setCurrentTab={setCurrentTab}/>
      <div className="info-container">
        {(currentTab === 0) 
          ? <InformationTab/> 
          : <RedditPostsTab/>}
      </div>
    </div>
  )
}

export default ResultSection;