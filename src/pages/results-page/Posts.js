import React, { Fragment, useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import DefaultImg from '../../assets/default.jpeg';

const Posts = (props) => {
  const [posts, setPosts] = useState([]);
  const [artist, setArtist] = useState(props.artist.replace(' ', ''));
  const [album, setAlbum] = useState('');
  const [song, setSong] = useState(props.song);


  // https://www.reddit.com/r/Music/search.json?q=${artist}%20${song}%20${album}&restrict_sr=1&sr_nsfw=&sort=relevance&t=all
  useEffect(() => {
    const getPostsFromRArtist = async() => {
      await fetch(`https://www.reddit.com/r/${artist}/search.json?q=${song}%20${album}&restrict_sr=1&sr_nsfw=&sort=relevance&t=all`).then(
        res => {
          if (res.status !== 200) {
            console.log('warning - something went wrong');
            return;
          }
          res.json().then(data => {
            if (data != null) {
              let results = data.data.children;
              console.log(results);
              for(let count = 0; count < results.length; count++) {
                setPosts(posts => [...posts, {key: count, 
                  url: results[count].data.url, title: results[count].data.title,
                  thumbnail: results[count].data.thumbnail}]);
              }
            } else {
              console.log('warning - subreddit might not exist');
            }
          })
        }
      )
    }

    // const setDefaultImg = () => {
    //   for(let count = 0; count < posts.length; count++) {
    //     if(posts[count].)
    //   }
    // }

    console.log('looking up reddit...');
    getPostsFromRArtist().catch(console.log);
  }, [])

  const title = {color: "black", fontFamily: "Courier New", fontSize: 13, fontWeight: 300};

  function openTab(url) {
    console.log(url);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return(
    <Fragment>
      <div className='row d-flex justify-content-center'>
          {posts.map((post) => (
            <div className='col-5 col-md-4 col-lg-3 m-3 text-center' style={{border: '1px solid'}}>
              <div className='row d-flex justify-content-center'>
                <img src={post.thumbnail} style={{height: '10rem', width: '10rem'}}/>
              </div>
              <div className='row d-flex justify-content-center'>
                <p style={title}>{post.title}</p>
              </div>
              <div className='row d-flex justify-content-center'>
              <Button onClick={() => {openTab(post.url)}}>view on Reddit</Button>
              </div>
            </div>
          ))}
      </div>
    </Fragment>
  )
} 

export default Posts;