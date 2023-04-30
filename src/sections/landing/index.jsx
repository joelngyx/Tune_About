import React, { useRef, useState } from "react";

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
      setErrorMsg("Please provide values in the above fields");
    } else {
      let queryArtist = artist.toLowerCase();
      let querySong = song.toLowerCase();
      let searchString = `https://itunes.apple.com/search?term=${querySong}+${queryArtist}&limit=10&entity=song`;

      fetch (searchString).then (
        (res) => {
          return res.json();
        }
      ).then(
        (data) => {
          console.log(data);
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


  /* Finds songs that could have been made by the artist provided by users */
  const getSuggestedSongs = () => {
    setSuggestedArtists([]);
    if (!checkIfFieldIsValid(artist)) {
      setErrorMsg("Please provide values in the above fields");
    } else {
      let queryArtist = artist.toLowerCase();
      let searchString = `https://itunes.apple.com/search?term=${queryArtist}&limit=25`;

      fetch (searchString).then (
        (res) => {
          return res.json();
        }
      ).then(
        (data) => {
          console.log(data)
          let temp = [];
  
          for (let i = 0; i < data.results.length; i ++) {
            if (!checkIfURLIsValid(data.results[i].artworkUrl100)) {
              data.results[i].artworkUrl100 = LlamaImg;
            }

            if (data.results[i].wrapperType === "track"
              && getJaccardIndex(queryArtist, data.results[i].artistName) > 0.2) {
              temp.push(data.results[i]);
            }
          }

          console.log(temp);
  
          setSuggestedSongs(temp);
          setErrorMsg("Possible songs from this artist:");
        }
      ).catch(
        (e) => {
          console.log(e);
          setErrorMsg("Oops, something went wrong");
        }
      )
    }
  }

  /* Used to check if the suggested results are relevant */
  const getJaccardIndex = (input, result) => {
    input = input.toLowerCase();
    result = result.toLowerCase();

    let userInputSet = new Set(); // a set of letters in the user's input
    let searchResultSet = new Set(); // a set of letters in the search's output

    for (let i = 0; i < input.length; i ++) {
      userInputSet.add(input.charAt(i));
    }

    for (let j = 0; j < result.length; j ++) {
      searchResultSet.add(result.charAt(j));
    }

    let intersection = new Set([...userInputSet].filter(val => searchResultSet.has(val)));
    let union = new Set([...userInputSet, ...searchResultSet]);

    return (intersection.size / union.size);
  }


  /* Sets the artist name input, based on the argument passed */
  const selectArtistName = (val) => {
    artistRef.current.value = val;
    setArtist(val);
  }

  const selectSongName = (val) => {
    songRef.current.value = val;
    setSong(val);
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
            onChange={e => setSong(e.target.value)}
            ref={songRef}></input>
          <input placeholder="Provide an artist name"
            onChange={e => setArtist(e.target.value)}
            ref={artistRef}></input>
          <div className="error-container"><p>{errorMsg}</p></div>
          <div className="suggestions-list">
          {
            (suggestedArtists.length === 0) 
            ? (suggestedSongs).map((item, index) => {
                return (
                  <div className="suggestions-tile"
                    key={index}
                    onClick={() => selectSongName(item.trackName)}>
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
            Look up possible artists
          </button>
          <button className="text-button" onClick={getSuggestedSongs}>
            Look up possible songs
          </button>
          <button onClick={() => {
            console.log(suggestedArtists);
            console.log(suggestedSongs);          
            }}>
            debug
          </button>
        </div>
      </div>  
    </div>
  )
}

export default LandingSection;