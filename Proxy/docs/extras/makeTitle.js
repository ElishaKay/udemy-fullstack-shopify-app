const makeTitle = (slug) => {
    let title = slug ? slug.split('//')[1].split('.')[0] : '';

    if(title.includes('-')){
      let words = title.split('-');
      for (var i = 0; i < words.length; i++) {
        let word = words[i];
        words[i] = word.charAt(0).toUpperCase() + word.slice(1);
      }

      return words.join(' '); 
    }

    let capitalizedTitle = title ? title.charAt(0).toUpperCase() + title.slice(1) : '';

    return capitalizedTitle;
  }