import React, { useRef, useState } from "react";

import "./style.scss";

import Logo from "./assets/logo.svg";
import LlamaImg from "./assets/llama.png";

const LandingSection = (props) => {
  const [artist, setArtist] = useState("");
  const artistRef = useRef(null);
  const [song, setSong] = useState("");
  const [suggestedArtists, setSuggestedArtists] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");


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
    if (!checkIfFieldIsValid(song)) {
      setErrorMsg("Please provide values in the above fields")
    } else {
      let queryArtist = artist.toLowerCase();
      let querySong = song.toLowerCase();
      let searchString = `https://itunes.apple.com/search?term=${querySong}+${queryArtist}&limit=7&entity=song`;

      fetch (searchString).then (
        (res) => {
          return res.json();
        }
      ).catch (
        (e) => {
          console.log(e);
          setErrorMsg("Oops, something went wrong");
        }
      ).then(
        (data) => {
          let temp = [];
  
          for (let i = 0; i < data.results.length; i ++) {
            if (!checkIfURLIsValid(data.results[i].artworkUrl100)) {
              data.results[i].artworkUrl100 = LlamaImg;
            }

            temp.push(data.results[i]);
          }
  
          setSuggestedArtists(temp);
          setErrorMsg("Possible artists for this song:");
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
  const selectArtistName = (val) => {
    artistRef.current.value = val;
    setArtist(val);
  }


  /* Passes song and artist names to the next section, changes current section to 1 */
  const proceedToNextSection = () => {
    if (checkIfFieldIsValid(song) && checkIfFieldIsValid(artist)) {
      props.setSongName(song);
      props.setArtistName(artist);
      props.setSection(1);
    } else {
      setErrorMsg("Please provide values in the above fields");
    }
  }

  
  return (
    <div className="landing">

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
            onChange={e => setSong(e.target.value)}></input>
          <input placeholder="Provide an artist name"
            onChange={e => setArtist(e.target.value)}
            ref={artistRef}></input>
          <div className="error-container"><p>{errorMsg}</p></div>
          <div className="suggestions-list">
          {
            (suggestedArtists).map((item, index) => {
              return (
                <div className="suggestions-tile"
                  key={index}
                  onClick={() => selectArtistName(item.artistName)}>
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
          <button className="text-button" onClick={getSuggestedArtists}>
            Look up possible artists for this song
          </button>
        </div>
      </div>  
    </div>
  )
}

export default LandingSection;