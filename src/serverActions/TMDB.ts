export const fetchMoviesDetail = (movie_id: string) => {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer YOUR_API_KEY' 
        }
    };

    fetch(`https://api.themoviedb.org/3/movie/${movie_id}?language=en-US`, options)
        .then(res => res.json())
        .then(res => console.log(res))
        .catch(err => console.error(err));
};
