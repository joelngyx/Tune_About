import React, { useEffect, useState } from "react";

// eslint-disable-next-line
import LlamaSVG from "../../assets/llama.svg";
import UpvoteSVG from "../../assets/upvoteicon.svg";
import "./style.scss";


const RedditPostsTab = (props) => {
  const [redditPosts, setRedditPosts] = useState([]);
  const [selectedSubreddit, setSelectedSubreddit] = useState(0);
  const [errorMsg, setErrorMsg] = useState("Loading...");



  /* Check if there are search results */
  const getSearchResults = (val) => {
    let redditURL = `https://www.reddit.com${val}/search.json?q=${props.songName}%20${props.album}&restrict_sr=1&sr_nsfw=&sort=relevance&t=all&limit=50`;
    
    fetch(
      redditURL
    ).then(
      (res) => {
        if (!res.ok) {
          throw new Error(0);
        } else {
          return res.json();
        }
      }
    ).then(
      (data) => {
        if (data !== undefined && data !== null) {
          let results = data.data.children;
          let temp = [];

          if (results.length === 0) {
            throw new Error(1);
          }

          for (let i = 0; i < results.length; i ++) {
            let entry = {
              author: results[i].data.author,
              permalink: `https://www.reddit.com${results[i].data.permalink}`,
              subreddit: results[i].data.subreddit_name_prefixed,
              subscribers: results[i].data.subreddit_subscribers,
              thumbnail: results[i].data.thumbnail,
              title: results[i].data.title,
              text: results[i].data.selftext,
              upvotes: results[i].data.ups,
              upvote_ratio: results[i].data.upvote_ratio
            }
            temp.push(entry)
          }

          setRedditPosts(temp);
        } 
      }
    ).catch((e) => {
      if (e.message === "0") {
        setErrorMsg(
          "Something went wrong accessing this subreddit (the subreddit might not exist)"
        );
      } else if (e.message === "1") {
        setErrorMsg(
          "No revlevant posts found on this subreddit :("
        );
      }
    })
  }
   


  /* Go to permalink in new tab */
  const openTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };



  /* Switch subreddit */
  useEffect(() => {
    setRedditPosts([]);
    setErrorMsg("Loading...");

    switch (selectedSubreddit) {
      case (0): 
        /* artist's subreddit */
        getSearchResults(`/r/${props.artistName.replaceAll(" ", "")}`);
        break;
      case (1): 
        /* r/all */
        getSearchResults("");
        break;
      case (2): 
        /* r/music */
        getSearchResults("/r/music");
        break;
      case (3):
        /* r/songmeanings */
        getSearchResults("/r/songmeanings");
        break;
      case (4):
        /* r/ifyoulikeblank */
        getSearchResults("/r/ifyoulikeblank");
        break;
      case (5):
        /* r/musicsuggestion */
        getSearchResults("/r/musicsuggestions");
        break;
      case (6):
        /* artist's circlejerk subreddit */
        getSearchResults(`/r/${props.artistName.replaceAll(" ", "")}circlejerk`);
        break;
      default:
        break;
    }

    // eslint-disable-next-line 
  }, [selectedSubreddit])



  useEffect(() => {
    setSelectedSubreddit(0);
    // eslint-disable-next-line
  }, [])



  return (
    <div className="reddit-tab">
      <div className="subreddits-container">
        <button className={(selectedSubreddit === 0) ? "selected" : ""}
          onClick={() => {setSelectedSubreddit(0)}}>
          Artist's subreddit
        </button>
        <button className={(selectedSubreddit === 6) ? "selected" : ""}
          onClick={() => {setSelectedSubreddit(6)}}>
          Artist's circlejerk subreddit
        </button>
        <button className={(selectedSubreddit === 1) ? "selected" : ""}
          onClick={() => {setSelectedSubreddit(1)}}>
          r/all
        </button>
        <button className={(selectedSubreddit === 2) ? "selected" : ""}
          onClick={() => {setSelectedSubreddit(2)}}>
          r/music
        </button>
        <button className={(selectedSubreddit === 3) ? "selected" : ""}
          onClick={() => {setSelectedSubreddit(3)}}>
          r/songmeanings
        </button>
        <button className={(selectedSubreddit === 4) ? "selected" : ""}
          onClick={() => {setSelectedSubreddit(4)}}>
          r/ifyoulikeblank
        </button>
        <button className={(selectedSubreddit === 5) ? "selected" : ""}
          onClick={() => {setSelectedSubreddit(5)}}>
          r/musicsuggestion
        </button>
      </div>
      {(redditPosts === undefined || redditPosts.length === 0)
        ? <div className="reddit-error">
            <img src={LlamaSVG} alt="error llama"></img>
            <p className="italicised">{errorMsg}</p>
          </div>
        : <></>}
      {redditPosts.map((item, index) => {
        return <div className="reddit-post-container" key={index}>
          <h1>{item.title}</h1>
          <div className="post-header">
            <p className="subtitle">
              <img alt="upvote icon" src={UpvoteSVG}></img>
              Upvotes: {item.upvotes}
            </p>
          </div>
          {(item.thumbnail !== null 
            && item.thumbnail !== undefined
            && item.thumbnail !== "default"
            && item.thumbnail !== "self") 
            ? <img alt="thumnail" 
              src={(item.thumbnail) ? item.thumbnail : LlamaSVG}></img> 
            : <></>}
          <p className="subtitle">Posted by: u/{item.author}</p>
          <p className="subtitle">From: {item.subreddit} [{item.subscribers} subscribers]</p>
          <p className="subtitle">Upvote ratio: {item.upvote_ratio}</p>
          <button onClick={() => {
            openTab(item.permalink);
          }}>View post on Reddit</button>
          <p className="post-text">{item.text}</p>
        </div>
      })}
    </div>)
}

export default RedditPostsTab;