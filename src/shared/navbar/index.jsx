import React, { useEffect, useRef } from "react";

import "./style.scss";


const NavBar = (props) => {
  const informationTabRef = useRef(null);
  const redditPostsTabRef = useRef(null);
  


  /* Go back to landing section */
  const goToLandingSection = () => {
    props.setSection(0);
  }



  /* Switch to Song information tab */
  const switchToInformationTab = () => {
    props.setCurrentTab(0);
    informationTabRef.current.classList.add("selected");
    redditPostsTabRef.current.classList.remove("selected");
  }


  
  /* Switch to Reddit posts tab */
  const switchToRedditPostsTab = () => {
    props.setCurrentTab(1);
    redditPostsTabRef.current.classList.add("selected");
    informationTabRef.current.classList.remove("selected");
  }



  useEffect(() => {
    switchToInformationTab();
    // eslint-disable-next-line
  }, []);



  return (
    <div className="navbar">
      <div className="navbar-item" onClick={goToLandingSection}>Back</div>
      <div className="navbar-item" ref={informationTabRef}
        onClick={switchToInformationTab}>Information</div>
      <div className="navbar-item" ref={redditPostsTabRef}
        onClick={switchToRedditPostsTab}>Reddit</div>
    </div>
  )
}

export default NavBar;