import React, { useRef, useState } from "react";
import getJaccardIndex from "../../shared/functions/getJaccardIndex";

import "./style.scss";

import Logo from "./assets/logo.svg";
import LlamaImg from "./assets/llama.png";


const LandingSection = (props) => {
  const [artist, setArtist] = useState("")
  const [song, setSong] = useState("");
  const [suggestedArtists, setSuggestedArtists] = useState([]);
  const [suggestedSongs, setSuggestedSongs] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  const artistRef = useRef(null);
  const songRef = useRef(null);

  const landingDivRef = useRef(null);



  /* Checks validity of a field (must not be empty) */
  const checkIfFieldIsValid = (val) => {
    let temp = val.replaceAll(" ", "");

    if (temp.length === 0) {
      return false;
    } else {
      return true;
    }
  }



  /* Check if url returns an image, to use default image if image cannot be fetched from url */
  const checkIfURLIsValid = (val) => {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(val);
  }



  /* Finds artists that could have made the song provided by users */
  const getSuggestedArtists = () => {
    setSuggestedSongs([]);

    if (!checkIfFieldIsValid(song)) {
      setErrorMsg("Please provide a song name");
    } else {
      let querySong = song.toLowerCase();
      let searchString = `https://itunes.apple.com/search?term=${querySong}&limit=25&entity=song`;

      fetch (searchString).then (
        (res) => {
          return res.json();
        }
      ).then(
        (data) => {
          let temp = [];
  
          for (let i = 0; i < data.results.length; i ++) {
            const isArtistSuggested = temp.some(item => item.artistName === data.results[i].artistName);

            if (!isArtistSuggested) {
              if (!checkIfURLIsValid(data.results[i].artworkUrl100)) {
                data.results[i].artworkUrl100 = LlamaImg;
              } else {
                data.results[i].artworkUrl100 = data.results[i].artworkUrl100.replace(/100x100/, `300x300`);
              }
  
              temp.push(data.results[i]);
            }
          }
          
          if (temp.length > 0) {
            setSuggestedArtists(temp);
            setErrorMsg("Possible artists for this song:");
          } else {
            setErrorMsg("Could not find anything :(");
            setSuggestedArtists([]);
          }
        }
      ).catch(
        (e) => {
          console.log(e);
          setErrorMsg("Oops, something went wrong");
        }
      )
    }
  }



  /* Finds songs that could have been made by the artist provided by users */
  const getSuggestedSongs = () => {
    setSuggestedArtists([]);

    if (!checkIfFieldIsValid(artist)) {
      setErrorMsg("Please provide an artist name");
    } else {
      let queryArtist = artist.toLowerCase();
      let searchString = `https://itunes.apple.com/search?term=${queryArtist}&limit=50`;

      fetch (searchString).then (
        (res) => {
          return res.json();
        }
      ).then(
        (data) => {
          let temp = [];
  
          for (let i = 0; i < data.results.length; i ++) {
            if (!checkIfURLIsValid(data.results[i].artworkUrl100)) {
              data.results[i].artworkUrl100 = LlamaImg;
            } else {
              data.results[i].artworkUrl100 = data.results[i].artworkUrl100.replace(/100x100/, `500x500`);
            }

            if (data.results[i].wrapperType === "track"
              && getJaccardIndex(queryArtist, data.results[i].artistName) > 0.9) {
              temp.push(data.results[i]);
            }
          }

          if (temp.length > 0) {
            setSuggestedSongs(temp);
            setErrorMsg("Possible songs for this artist:");
          } else {
            setErrorMsg("Could not find anything :(");
            setSuggestedSongs([]);
          }
        }
      ).catch(
        (e) => {
          console.log(e);
          setErrorMsg("Oops, something went wrong");
        }
      )
    }
  }



  /* Sets the artist name input, based on the argument passed */
  const selectSuggestion = (val1, val2) => {
    artistRef.current.value = val1;
    songRef.current.value = val2;
    setArtist(val1);
    setSong(val2);
  }



  /* Passes song and artist names to the next section, changes current section to 1 */
  const proceedToNextSection = () => {
    if (checkIfFieldIsValid(song) && checkIfFieldIsValid(artist)) {
      landingDivRef.current.style.animation = "slide-to-right 1s ease-in-out 0s forwards";

      setTimeout(() => {
        props.setSongName(song);
        props.setArtistName(artist);
        props.setSection(1);
      }, 1000);
    } else {
      setErrorMsg("Please provide values in the above fields");
    }
  }

  

  return (
    <div className="landing"
      ref={landingDivRef}>

      {/* This container contains the app's logo, name and description */}
      <div className="landing-container-1 landing-container">
        <div className="landing-header">
          <img className="landing-logo" alt="Logo" src={Logo}/>
          <h1>Tune About</h1>
          <p>
            Provide a song's name and artist, This web application
            will return relevant information.
          </p>
        </div>
      </div>

      {/* This container contains the fields to search for a particular song */}
      <div className="landing-container-2 landing-container">
        <div className="landing-form">
          <input placeholder="Provide a song name"
            onChange={e => setSong(e.target.value)}
            ref={songRef}></input>
          <input placeholder="Provide an artist name"
            onChange={e => setArtist(e.target.value)}
            ref={artistRef}></input>
          <div className="suggestion-buttons-container">
            <button className="text-button" onClick={getSuggestedArtists}>
              Find possible artists
            </button>
            <button className="text-button" onClick={getSuggestedSongs}>
              Find possible songs
            </button>
          </div>
          <div className="error-container"><p>{errorMsg}</p></div>
          <div className="suggestions-list">
          {
            (suggestedArtists.length === 0) 
            ? (suggestedSongs).map((item, index) => {
                return (
                  <div className="suggestions-tile"
                    key={index}
                    onClick={() => selectSuggestion(item.artistName, item.trackName)}>
                    <img alt="artwork" src={item.artworkUrl100}/>
                    <div>
                      <p>{item.trackName}</p>
                    </div>
                  </div>
                )
              })
            : (suggestedArtists).map((item, index) => {
                return (
                  <div className="suggestions-tile"
                    key={index}
                    onClick={() => selectSuggestion(item.artistName, item.trackName)}>
                    <img alt="artwork" src={item.artworkUrl100}/>
                    <div>
                      <p>{item.artistName}</p>
                    </div>
                  </div>
                )
              })
          }
          </div>
          <button className="form-submit-button" onClick={proceedToNextSection}>Get relevant information</button>
        </div>
      </div>  
    </div>
  )
}

export default LandingSection;