import React, { useState } from "react";

/* JSX Components for each section */
import LandingSection from "./sections/landing";
import ResultSection from "./sections/results";

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
        <ResultSection songName={songName}
          setSongName={setSongName}
          artistName={artistName}
          setArtistName={setArtistName}
          setSection={setSection}/>);
    default:
      return (<p>Looks like something went wrong</p>)
  }
}

export default App;
