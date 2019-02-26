class Search extends HTMLElement {
    constructor() {
    super();
    this.db = new appDatabase();

    var shadowRoot = this.attachShadow({mode: 'open'});

    var template = document.getElementById('search-template').content;
    shadowRoot.appendChild(template.cloneNode(true));
    }   
    
    connectedCallback() {
        const searchButton = this.shadowRoot.querySelector('#search-col');
        searchButton.addEventListener('click', (e) => {
            const searchInput = this.shadowRoot.querySelector('#search-form').value;
            this.db.fetchFromDatabase(cardUrl + '?q=' + searchInput, _searchCallback, [this])
        })
    }
       
}

function _searchCallback(self, data) {
    const searchInput = self.shadowRoot.querySelector('#search-form');
    const value = searchInput.value;
    let event = new CustomEvent("Search", {
        detail: {
            result: data,
            input: value
        },
        bubbles: true,
        cancelable: false
    })
    self.dispatchEvent(event);
}


customElements.define('app-search', Search);
