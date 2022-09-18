import React, { Fragment, useEffect, useState } from 'react';
import DefaultImg from '../../assets/llamaWhite.svg';
import LlamaSVG from '../../assets/llama.svg';
import Card from 'react-bootstrap/Card';
import LinkTo from './LinkTo';

const Posts = (props) => {
  const [posts, setPosts] = useState([]);
  // eslint-disable-next-line
  const [artist, setArtist] = useState(props.artist.replaceAll(' ', ''));
  // eslint-disable-next-line
  const [album, setAlbum] = useState('');
  // eslint-disable-next-line
  const [song, setSong] = useState(props.song);
  const [apiString, setApiString] = useState(`https://www.reddit.com/r/${artist}/search.json?q=${song}%20${album}&restrict_sr=1&sr_nsfw=&sort=relevance&t=all`);
  
  useEffect(() => {
    // eslint-disable-next-line
    switch (props.fetchType) {
      case 0:
        setPosts([]);
        setApiString(`https://www.reddit.com/r/${artist}/search.json?q=${song}%20${album}&restrict_sr=1&sr_nsfw=&sort=relevance&t=all`);
        break;
      case 1:
        setPosts([]);
        setApiString(`https://www.reddit.com/r/Music/search.json?q=${artist}%20${song}%20${album}&restrict_sr=1&sr_nsfw=&sort=relevance&t=all`);
        break;
      case 2:
        setPosts([]);
        setApiString(`https://www.reddit.com/search/.json?q=${artist}%20${song}%20${album}`);
        break;
    }
    // eslint-disable-next-line
  }, [props.fetchType])

  // eslint-disable-next-line
  useEffect(() => {
    const getPostsFromRArtist = async() => {
      await fetch(apiString).then(
        res => {
          if (res.status !== 200) {
            return;
          }
          res.json().then(data => {
            if (data != null) {
              let results = data.data.children;
              // console.log(results);
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
        })
      }

    getPostsFromRArtist().catch(console.log);
    // eslint-disable-next-line
  }, [apiString])

  // styles 
  const title = {color: "white", fontFamily: "Courier New", fontSize: 18, fontWeight: 800};
  const errorStyle = {color: "black", fontFamily: "Courier New", fontSize: 22, fontWeight: 800};
  const bodyText = {color: "white", fontFamily: "Courier New", fontSize: 16, fontWeight: 100, overflowWrap: 'break-word'};
  const postStyle = {backgroundColor: 'black', borderRadius: '5px', overflowWrap: 'break-word'};

  if (posts.length > 0) {
    return(
      <Fragment>
        <div className='col-12'>
          <div className='row d-flex justify-content-center'>
              {posts.map((post) => (
                <div className='col-10 col-lg-5 m-3 text-center p-3' style={postStyle} key={post.key}>
                  <Card className='text-center p-5' style={{backgroundColor: 'black', color: 'white'}}>
                    <Card.Img variant='top' src={post.thumbnail}/>
                  </Card>
                  <Card.Body>
                    <Card.Title style={title}>{post.title}</Card.Title>
                    <Card.Text style={bodyText}>{post.selfText}</Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <LinkTo permalink={post.permalink} website='reddit'/>
                  </Card.Footer>
                </div>
              ))}
          </div>
        </div>
      </Fragment>
    )
  } else {
    return (
      <Fragment>
        <div className='col-10'>
        {/* eslint-disable-next-line */}
          <img className='mt-5' src={LlamaSVG} style={{width: '15rem'}}/>
        </div>  
        <div className='col-10'>
          <h1 className='mt-2' style={errorStyle}>no posts found</h1>
        </div>
      </Fragment>)
  }
} 

export default Posts;