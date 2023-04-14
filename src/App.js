import React, { useState } from "react";

/* JSX Components for each section */
import LandingSection from "./sections/landing";
import Section1 from "./sections/section-1";
import Section2 from "./sections/section-2";

/* Styles */
import "./shared/styles/main.scss";


const App = () => {
  /* States */
  const [section, setSection] = useState(0);

  const [songName, setSongName] = useState();
  const [artistName, setArtistName] = useState();

  switch (section) {
    case (0):
      return (
        <LandingSection setSongName={setSongName}
          setArtistName={setArtistName}
          setSection={setSection}/>
      );
    case (1): 
      return (
        <Section1 songName={songName}
          artistName={artistName}/>);
    case (2):
      return (<Section2/>);
    default:
      return (<p>Looks like something went wrong</p>)
  }
}

export default App;
