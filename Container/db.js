class appDatabase {
    fetchFromDatabase(url, callback, callbackArgs) {
        fetch(url)
        .then(res => res.json())
        .then(data=> {
            callbackArgs.push(data);
            callback.apply(null, callbackArgs);
        })
    }


    addToDatabase(url, data, callback, callbackArgs) {
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
              'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if(res.ok) {
                callback.apply(null, callbackArgs);
            }
        })
        .catch(error => console.log(error));
    }

    removeFromDatabase(url, callback, callbackArgs) {
        fetch(url,  {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(data => {
            if(callback) {
                callback.apply(null, callbackArgs);
            }
        })
        .catch(error => console.log(error))
    }

    modifyDataInDatabase(url, data, callback, callbackArgs) {
        fetch(url, {
			method: 'PATCH',
			body: JSON.stringify(data),
			headers:{
				'Content-Type': 'application/json'
        }})
        .then(res => res.json())
        .then(data=> {
            if(callback) {
                callback.apply(null, callbackArgs);
            }
        })
        .catch(error => { console.log(error); })
    }
}


