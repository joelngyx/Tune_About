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

export default getJaccardIndex;