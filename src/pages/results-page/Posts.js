import React, { Fragment, useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';

const Posts = (props) => {
  const [posts, setPosts] = useState([]);
  const [artist, setArtist] = useState(props.artist);
  const [album, setAlbum] = useState('');
  const [song, setSong] = useState(props.song);

  useEffect(() => {
    const getPostsFromRMusic = async() => {
      await fetch(`https://www.reddit.com/r/Music/search.json?q=${artist}%20${song}%20${album}&restrict_sr=1&sr_nsfw=&sort=relevance&t=all`).then(
        res => {
          if (res.status !== 200) {
            console.log('warning - something went wrong 2');
            return;
          } 
          res.json().then(data => {
            if (data != null) {
              let results = data.data.children;
              for (let count = 0; count < results.length; count++) {
                console.log(results[count].data);
              }
            } else {
              console.log('does not exist!');
            }
          })
        }
      )
    }

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
              console.log(results.length);
              console.log(results[0].data.permalink);
              for(let count = 0; count < results.length; count++) {
                console.log(`count = ${count}`);
                setPosts(posts => [...posts, {key: count, permalink: results[count].data.permalink}]);
              }
              console.log(posts);
            } else {
              console.log('warning - subreddit might not exist');
              getPostsFromRMusic().catch(console.log);
            }
          })
        }
      )
    }

    console.log('looking up reddit...');
    getPostsFromRArtist().catch(console.log);
  }, [])

  return(
    <Fragment>
      {posts.map((post) => (
        // <Card className='text-left' style={{width: '25vw', height: '20vh', overflow: 'scroll'}}>

        // </Card>
        <p>{post.permalink}</p>
      ))}
    </Fragment>
  )
} 

export default Posts;