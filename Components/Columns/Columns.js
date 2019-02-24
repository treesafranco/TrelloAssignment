class Columns extends HTMLElement {
    constructor() {
    super();
    this.db = new appDatabase();

    var shadowRoot = this.attachShadow({mode: 'open'});

    var template = document.getElementById('columns-template').content;
    shadowRoot.appendChild(template.cloneNode(true));

    var columns = shadowRoot.querySelector('.columns');
    }

    get list() {
        return this._list;
      }
  
    set list(list) {
        this._list = list;
        this.render();
    }

    render() {
        let ulElement = this.shadowRoot.querySelector('.columns');
        ulElement.innerHTML = '';
      
        this.list.forEach(col => {
          let column = _createColumnElement(this, col);
          ulElement.appendChild(column);
        });
      }

      connectedCallback() {
        _attachEventListener(this);
      }
}

  function _attachEventListener(self) {

    self.shadowRoot.addEventListener('ColumnRemoved', (e) => {
      _removeColumn(self, e.detail.columnId);
    })

    self.shadowRoot.addEventListener('ColumnModified', (e) => {
      const id = parseInt(e.detail.columnId);
      const data = {
        title: e.detail.columnTitle
      }
      let uniqueTitle = true;

      // checking if unique title and id
      self.list.map((item) => {
        if(item.title === data.title) {
          uniqueTitle = false;
        }
      });

      if(uniqueTitle) {
        _modifyColumns(self, id, data);
      } 
    });

  }

  function _createColumnElement(self, col) {
    var column = document.createElement('app-column');

    column.setAttribute('id',col.id);
    column.setAttribute('class', "app-column");

    var input = document.createElement('input');
    input.setAttribute('slot', 'column-title');
    input.value = col.title;

    column.appendChild(input);
     
    return column;
  }

  function _removeColumn(self, id) {
    const url = colUrl+ '/' + id;
    self.db.removeFromDatabase(url, _removeColumnCallback , [self])
  }

  function _removeColumnCallback(self) {
    _fetchColumns(self);
    _deleteColumnCards(self);
  }

  function _deleteColumnCards(self, id) {
    const column = self.shadowRoot.querySelector('.app-column');
    const cardList = column.cards;
    cardList.map(item => {
      if(item.columnId == id) {
        self.db.removeFromDatabase(url, null, null)
      }
    });
  }

  function _fetchColumns(self) {
    self.db.fetchFromDatabase(colUrl, _fetchColumnsCallbback, [self]);
  }

  function _fetchColumnsCallbback(self, data) {
    const list = data;
    self.list = list;
  }

  function _modifyColumns(self, id, data) {
    self.db.modifyDataInDatabase(colUrl + '/' + id, data, null, null);
  }


customElements.define('app-columns', Columns);