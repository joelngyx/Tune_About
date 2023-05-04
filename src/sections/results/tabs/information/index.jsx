import React, { useEffect, useState } from "react";

import "./style.scss";


const InformationTab = (props) => {
  const [details, setDetails] = useState();
  const [lyrics, setLyrics] = useState();



  /* Function that gets Jaccard Similarity between 2 words */
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



  /* Gets the artist name from the searches that has the highest Jaccard Index with the user's input */
  const getAutoCorrectedWord = (data, queryArtist) => {
    let maxIndex = 0;
    let result;

    for (let i = 0; i < data.resultCount; i ++) {
      let tempIndex = getJaccardIndex(queryArtist, data.results[i].artistName);

      if (tempIndex > maxIndex) {
        maxIndex = tempIndex;
        result = i;
      }
    }

    return (data.results[result].artistName);
  }



  /* Fetch Album information */
  const getAlbumDetails = () => {
    let queryArtist = props.artistName;
    let data = props.dataObject;
    
    console.log(data);

    let correctArtistName = getAutoCorrectedWord(data, queryArtist);
    let correctEntry = getOldestAlbum(data, correctArtistName);
    
    props.setSongName(correctEntry.trackName);
    props.setArtistName(correctEntry.artistName);

    const detailsTemp = {
      artistID: correctEntry.artistId,
      artworkURL: correctEntry.artworkUrl100,
      albumName: correctEntry.collectionName,
      albumID: correctEntry.collectionId, 
      trackNumber: correctEntry.trackNumber,
      discNumber: correctEntry.discNumber,
      releaseDate: correctEntry.releaseDate.substring(0,4),
      trackPreview: correctEntry.previewUrl,
      genre: correctEntry.primaryGenreName
    }

    setDetails(detailsTemp);
    getLyrics(correctEntry.trackName, correctEntry.artistName);
  }



  /* Get the most relevant album, by getting the oldest album that is not a compilation album */
  const getOldestAlbum = (data, correctArtistName) => {
    let minDate = new Date();
    let result;
    let backupResult2;
    let backupResult1;

    for (let i = 0; i < data.resultCount; i ++) {
      let curr = data.results[i];

      if (correctArtistName === curr.artistName) {
        let tempDate = new Date(curr.releaseDate);
        console.log(`${i} ${curr.collectionName} mindate: ${minDate}, tempdate: ${tempDate}`);
        if (minDate >= tempDate) {
          minDate = tempDate;
          let lowerCaseAlbumName = curr.collectionName.toLowerCase();
          if (lowerCaseAlbumName.includes("greatest hits") 
              || lowerCaseAlbumName.includes("best of")
              || lowerCaseAlbumName.includes("sped up")
              || lowerCaseAlbumName.includes("cover")) {
            backupResult2 = curr;
          } else if (lowerCaseAlbumName.includes("single")) {
            backupResult1 = curr;
          } else {
            result = curr;
          }
        }
      }
    }

    if (result === undefined) {
      if (backupResult1 === undefined) {
        return backupResult2;
      } else {
        return backupResult1;
      }
    } else {
      return result;
    }
  } 



  /* Fetch lyrics */
  const getLyrics = (correctSongName, correctArtistName) => {
    console.log(process.env.REACT_APP_TEST)
    fetch(
      `https://some-random-api.com/lyrics/?title=${correctSongName}${correctArtistName}`
    ).then(
      (res) => {
        return res.json();
      }
    ).then(
      (data) => {
        setLyrics(data.lyrics);
      }
    ).catch(
      (e) => {
        console.log("Error getting lyrics");
      }
    )
  }



  /* On component mount */
  useEffect(() => {
    getAlbumDetails();
    // eslint-disable-next-line
  }, [])



  return (<div className="information-tab">
    <div className="song-details-container">
      {(details) 
        ? <>
            <img alt="album art" src={details.artworkURL.replace(/100x100/, `750x750`)}/>
            <div>
              <h1>{props.songName}</h1>
              <p>{props.artistName}</p>
              <audio preload="true" controls controlsList="nofullscreen nodownload noremoteplayback noplaybackrate" src={details.trackPreview}></audio>
              <p>{details.albumName} - Track {details.trackNumber} of Disk {details.discNumber}</p>
              <p>Release Year: {details.releaseDate}</p>
              <p>Genre: {details.genre}</p>
            </div>
          </>
        : <p>Loading...</p>
      }
    </div>
    <div className="lyrics-container">
      {(details) 
        ? <>
            {(lyrics) 
              ? <>
                  <p className="bolded">Lyrics</p>
                  <p>{lyrics}</p>
                </>
              : <>
                  <p className="italicised">Oops, there was an error fetching lyrics</p>
                </>
            }
          </>
        : <p>Loading...</p>
      }
    </div>
  </div>)
}

export default InformationTab;