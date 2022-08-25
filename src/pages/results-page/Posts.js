import React, { Fragment, useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import DefaultImg from '../../assets/default.jpeg';
import LlamaSVG from '../../assets/llama.svg';

const Posts = (props) => {
  const [posts, setPosts] = useState([]);
  const [artist, setArtist] = useState(props.artist.replace(' ', ''));
  const [album, setAlbum] = useState('');
  const [song, setSong] = useState(props.song);
  const [apiString, setApiString] = useState(`https://www.reddit.com/r/${artist}/search.json?q=${song}%20${album}&restrict_sr=1&sr_nsfw=&sort=relevance&t=all`);
  
  useEffect(() => {
    switch (props.fetchType) {
      case 0:
        setApiString(`https://www.reddit.com/r/${artist}/search.json?q=${song}%20${album}&restrict_sr=1&sr_nsfw=&sort=relevance&t=all`);
        break;
      case 1:
        setApiString(`https://www.reddit.com/r/Music/search.json?q=${artist}%20${song}%20${album}&restrict_sr=1&sr_nsfw=&sort=relevance&t=all`);
        break;
      case 2:
        setApiString(`https://www.reddit.com/search/.json?q=${song}`);
        break;
    }
  }, [props.fetchType])

  useEffect(() => {
    console.log(props.fetchType);
    const getPostsFromRArtist = async() => {
      await fetch(apiString).then(
        res => {
          if (res.status !== 200) {
            return;
          }
          res.json().then(data => {
            if (data != null) {
              let results = data.data.children;
              console.log(results);
              let temp = [];

              for(let count = 0; count < results.length; count++) {
                temp[count] = {
                  key: count, permalink: results[count].data.permalink,
                  title: results[count].data.title, selfText: results[count].data.selftext
                }
                
                let currentThumbnail = results[count].data.thumbnail;

                if(currentThumbnail === '' || currentThumbnail === null ||
                    currentThumbnail === 'self' || currentThumbnail === undefined) {
                  temp[count].thumbnail = DefaultImg;
                } else {
                  temp[count].thumbnail = results[count].data.thumbnail
                }
              }

              setPosts(temp);
            } 
          })
        }
      )
      }

    getPostsFromRArtist().catch(console.log);
  }, [apiString])

  // styles 
  const title = {color: "white", fontFamily: "Courier New", fontSize: 18, fontWeight: 800};
  const errorStyle = {color: "black", fontFamily: "Courier New", fontSize: 22, fontWeight: 800};
  const bodyText = {color: "white", fontFamily: "Courier New", fontSize: 16, fontWeight: 100, overflowWrap: 'break-word'};
  const postStyle = {backgroundColor: 'black', borderRadius: '5px', overflowWrap: 'break-word'};
  const btnText = {color: "black", fontFamily: "Courier New", fontSize: 16, fontWeight: 800, backgroundColor: '#8A5656', border: '0px'};

  function openTab(permalink) {
    var url = `https://reddit.com/${permalink}`;
    console.log(url);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (posts.length > 0) {
    return(
      <Fragment>
        <div className='row d-flex justify-content-center'>
            {posts.map((post) => (
              <div className='col-10 col-md-5 m-3 text-center p-3' style={postStyle}>
                <h2 style={title}>{post.title}</h2> 
                <div className='row d-flex justify-content-center'>
                  <img src={post.thumbnail} style={{height: '10rem', width: '15rem', objectFit: 'contain'}}/>
                </div>
                <div className='row d-flex justify-content-center'>
                  <div className='container mx-3 mt-3'>
                    <p style={bodyText}>{post.selfText}</p>
                  </div>
                </div>
                <div className='row d-flex justify-content-center'>
                <Button style={btnText} onClick={() => {openTab(post.permalink)}}>view on Reddit</Button>
                </div>
              </div>
            ))}
        </div>
      </Fragment>
    )
  } else {
    return (
      <Fragment>
        <div className='col-12'>
          <img className='mt-5' src={LlamaSVG} style={{width: '15rem'}}/>
        </div>  
        <div className='col-12'>
          <h1 className='mt-2' style={errorStyle}>no posts found</h1>
        </div>
      </Fragment>)
  }
} 

export default Posts;