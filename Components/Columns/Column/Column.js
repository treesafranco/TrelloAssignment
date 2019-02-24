class Column extends HTMLElement {
    constructor() {
    super();
    this.db = new appDatabase();

    var shadowRoot = this.attachShadow({mode: 'open'});

    var template = document.getElementById('column-template').content;
    shadowRoot.appendChild(template.cloneNode(true));
    }   
    
    get id() {
        return  this.getAttribute('id');
      }
  
    set id(id) {
        this.setAttribute('value', id);
    }

    get cards() {
        return this._list;
      }
  
    set cards(list) {
        this._list = list;
        this.render();
    }

    render() {
        let cardElement = this.shadowRoot.querySelector('.cards');
        cardElement.innerHTML = '';
      
        this.cards.forEach(cd => {
            if(cd.columnId === parseInt(this.id)) {
                let card = _createCardElement(this, cd);
                cardElement.appendChild(card);
            }
        });
      }

    connectedCallback() {
        // remove a column
        const removeButton = this.shadowRoot.querySelector('.column-remove');
        removeButton.addEventListener('click', (e) => {       
            let event = new CustomEvent("ColumnRemoved", {
                detail: {
                    columnId: this.id
                },
                bubbles: true
                });

            this.dispatchEvent(event); 
        });

        // modify a column title
        const titleInput = this.shadowRoot.querySelector('.column-modify');
        titleInput.addEventListener('change', (e) => {
            let event = new CustomEvent("ColumnModified", {
                detail: {
                    columnId: this.id,
                    columnTitle: e.target.value
                },
                bubbles: true
            });

            this.dispatchEvent(event); 
        });

        // add a new card
        const addCardButton = this.shadowRoot.querySelector('.add-card');
        addCardButton.addEventListener('click', (e) => {
            const title = this.shadowRoot.querySelector('.card-title').value;
            const description = "";

            let uniqueTitle = true;
            let id = this.id + '_' + title;
            this.cards.map(item => {
                if(item.title == title) {
                    uniqueTitle = false;
                }
            });
            
            if(title && uniqueTitle) {
                let data = { id: id, title: title, description: description, columnId: parseInt(this.id)}
                _addCard(this, data);
            }

        });

        const addCard = this.shadowRoot.querySelector('.card-title');
        addCard.addEventListener('click', (e) => {
            let refreshEvent = new CustomEvent("refreshList", {
                detail: {},
                bubbles: true,
                cancelable: false
            });
            this.dispatchEvent(refreshEvent);
        });

        _fetchCards(this);
        _attachCardEventListener(this);
    }
    
}

function _attachCardEventListener(self) {
  
    // remove card
    self.shadowRoot.addEventListener('CardRemoved', (e) => {
      _removeCard(self, e.detail.cardId);
    })
    
    // edit card
    self.shadowRoot.addEventListener('CardModified', (e) => {
        let title = e.detail.title;
        let uniqueTitle = true;
        let data = {
            title: title,
            description: e.detail.description
        }

        self.cards.map(item => {
            if(item.title == title && item.id != e.detail.id) {
                uniqueTitle = false;
            }
        });

        if(title && uniqueTitle) {
            _modifyCard(self, e.detail.id, data);
        }
    })

    self.shadowRoot.addEventListener('refreshList', (e) => {
        _fetchCards(self);
    })

}

function _fetchCards(self) {
    self.db.fetchFromDatabase(cardUrl, _fetchCardsCallback, [self]);
}

function _fetchCardsCallback(self, data) {
    const list = data;
    self.cards = list;
}

function _createCardElement(self, item) {
    var card = document.createElement('app-card');

    card.setAttribute('id',item.id);
    card.setAttribute('colId', item.columnId);
    card.setAttribute('title', item.title);
    card.setAttribute('description', item.description);
    card.setAttribute('class', "app-card");

    var cardHeader = document.createElement('span');
    cardHeader.setAttribute('slot', 'card-header');
    cardHeader.textContent = item.title;
 
    card.appendChild(cardHeader);
    
    return card;
}

function _addCard(self, data) {
    self.db.addToDatabase(cardUrl, data, _addCardCallback, [self]);
}

function _addCardCallback(self) {
    self.shadowRoot.querySelector('input.card-title').value = "";
    _fetchCards(self);
}

function _removeCard(self, id) {
    self.db.removeFromDatabase(cardUrl+ '/' + id, _fetchCards, [self]);
}

function _modifyCard(self, id, data) {
    self.db.modifyDataInDatabase(cardUrl + '/' + id, data, _fetchCards, [self]);
}

customElements.define('app-column', Column);
