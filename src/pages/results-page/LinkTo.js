import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';

const LyricMeaningButton = (props) => {
	const [url, setUrl] = useState('');
	const [btnName, setBtnName] = useState('')
	const btnText = {color: "white", fontFamily: "Courier New", fontSize: 16, fontWeight: 800, backgroundColor: '#336671', border: '0px'};

	useEffect(() => {
		// eslint-disable-next-line
		switch(props.website) {
			case 'genius':
				setUrl(`https://genius.com/${props.artist.replaceAll(' ', '-')}-${props.song.replaceAll(' ', '-')}-lyrics`);
				setBtnName('Genius.com');
				break;
			case 'lyrics-mode':
				setUrl(`https://www.lyricsmode.com/lyrics/${props.artist.charAt(0)}/${props.artist.replaceAll(' ', '_')}/${props.song.replaceAll(' ', '_')}.html`);
				setBtnName('LyricsMode.com');
				break;
			case 'youtube':
				setUrl(`https://music.youtube.com/search?q=${props.artist.replaceAll(' ', '+')}+${props.song.replaceAll(' ', '+')}`);
				setBtnName('listen on youtube music');
				break;
			case 'song-meanings':
				setUrl(`https://songmeanings.com/query/?query=${props.artist}%20${props.song}&type=songtitles`);
				setBtnName('SongMeanings.com');
				break;
		}
	}, [])

	function openTab() {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

	return <Button className='m-2' style={btnText} onClick={() => {
		console.log(props)
		openTab();
	}}>{btnName}</Button>
}

export default LyricMeaningButton;