import React, { useEffect, useState } from "react";
import "./style.scss";


const InformationTab = (props) => {
  const [details, setDetails] = useState();
  const [lyrics, setLyrics] = useState();


  /* Handle errors */
  const handleError = (e) => {
    console.log(e);
  } 


  /* Auto-correct function using Jaccard Similarity */
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

    console.log(data.results[result].artistName)
    return (data.results[result].artistName);
  }


  /* Fetch Album information */
  const getAlbumDetails = () => {
    let queryArtist = props.artistName;
    let data = props.dataObject;
    
    let correctArtistName = getAutoCorrectedWord(data, queryArtist);
    let correctEntry = getOldestAlbum(data, correctArtistName);
    
    props.setSongName(correctEntry.trackName);
    props.setArtistName(correctEntry.artistName);

    const detailsTemp = {
      artistID: correctEntry.artistId,
      artworkURL: correctEntry.artworkUrl100,
      albumName: correctEntry.collectionName,
      albumID: correctEntry.collectionId, 
      releaseDate: correctEntry.releaseDate.substring(0,4),
      trackPreview: correctEntry.previewUrl
    }

    setDetails(detailsTemp);
    getLyrics(correctEntry.trackName, correctEntry.artistName);
  }

  const getOldestAlbum = (data, correctArtistName) => {
    let minDate = new Date();
    let result;
    let backupResult;

    for (let i = 0; i < data.resultCount; i ++) {
      let curr = data.results[i];

      if (correctArtistName === curr.artistName) {
        let tempDate = new Date(curr.releaseDate);
        console.log(`${i} ${curr.collectionName} mindate: ${minDate}, tempdate: ${tempDate}`);
        if (minDate >= tempDate) {
          minDate = tempDate;
          let lowerCaseAlbumName = curr.collectionName.toLowerCase();
          if (lowerCaseAlbumName.includes("greatest hits") || lowerCaseAlbumName.includes("best of")) {
            backupResult = curr;
          } else {
            result = curr;
          }
        }
      }
    }

    if (result === undefined) {
      return backupResult;
    } else {
      return result;
    }
  } 


  /* Fetch lyrics */
  const getLyrics = (correctSongName, correctArtistName) => {
    fetch(
      `https://some-random-api.ml/lyrics/?title=${correctSongName}${correctArtistName}`
    ).then(
      (res) => {
        return res.json();
      }
    ).then(
      (data) => {
        if (data.error) {
          handleError(data.error);
        } else {
          setLyrics(data.lyrics);
        }
      }
    ).catch(
      (e) => {
        console.log(e);
      }
    )
  }

  useEffect(() => {
    getAlbumDetails();
  }, [])


  return (<div className="information-tab">
    <div className="lyrics-container">
      {(details) 
        ? <>
            <p>{props.songName}</p>
            <p>{props.artistName}</p>
            <p>{details.albumName}</p>
            <p>{lyrics}</p>
          </>
        :
          <p>Loading...</p>
      }
    </div>
  </div>)
}

export default InformationTab;