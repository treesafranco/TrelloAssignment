const colUrl ='http://localhost:3000/columns';
const cardUrl ='http://localhost:3000/cards';


class Container extends HTMLElement {
    constructor() {
      super();
      this.columnList = [];
      this.db = new appDatabase();

      const shadowRoot = this.attachShadow({ mode: 'open' });

      const template = document.getElementById('container-template').content;
      shadowRoot.appendChild(template.cloneNode(true));

      this.onClickAddColumn = this.onClickAddColumn.bind(this);
    }

    onClickAddColumn(e) {
      const titleInput = this.shadowRoot.querySelector('.column-title');
     
      const title = titleInput.value;
      let uniqueTitle = true;
      let id = 0;

      this.columnList.map(x => {
        if(x.title === title) {
          uniqueTitle = false;
        }
        id = Math.max(id, x.id);
      });

      if(title && uniqueTitle) {
        titleInput.classList.remove('error');
        let data = { id: id + 1, title: title}
        _addColumn(this, data);
      } else {
        titleInput.classList.add('error');
      }

    }

    connectedCallback() {
      // add column
      const addColumn = this.shadowRoot.querySelector('.add-column');
      addColumn.addEventListener('click', this.onClickAddColumn, false);
      _fetchAndPopulateColumns(this);

      document.addEventListener('click', (e) => {
        if(document.activeElement.className !== 'app-container') {
          const titleInput = this.shadowRoot.querySelector('.column-title');
          titleInput.classList.remove('error');
        }
      })
    } 
}

function _fetchAndPopulateColumns(self) {
  self.db.fetchFromDatabase(colUrl, _fetchCloumnCallbackList, [self]);
}

function _fetchCloumnCallbackList(self, data) {
  let columnList = self.shadowRoot.querySelector('#app-columns');
  const list = data;
  self.columnList = list;
  columnList.list = list;
}

function _addColumn(self, data) {
  self.db.addToDatabase(colUrl, data, _addColumnCallback, [self]);
}

function _addColumnCallback(self) {
  self.shadowRoot.querySelector('input.column-title').value = "";
  _fetchAndPopulateColumns(self);
}

customElements.define('app-container', Container);
