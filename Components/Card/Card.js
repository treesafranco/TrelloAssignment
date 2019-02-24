class Card extends HTMLElement {
    constructor() {
        super();

        // Create a shadow root
        var shadowRoot = this.attachShadow({mode: 'open'});

        //create elements
        var template = document.getElementById('card-template').content;
        shadowRoot.appendChild(template.cloneNode(true));
   
    }

    get id() {
        return  this.getAttribute('id');
      }
  
    set id(id) {
        this.setAttribute('value', id);
    }

    get parentId() {
        return  this.getAttribute('ColId');
      }
  
    set parentId(id) {
        this.setAttribute('value', id);
    }

    get title() {
        return  this.getAttribute('title');
      }
  
    set title(title) {
        this.setAttribute('value', title);
    }

    get descrition() {
        return  this.getAttribute('description');
      }
  
    set descrition(desc) {
        this.setAttribute('value', desc);
    }

    connectedCallback() {
        var inputTitle = this.shadowRoot.querySelector('.card-title-modify');
        inputTitle.value = this.title;

        var inputDescription = this.shadowRoot.querySelector('.card-desc-modify');
        inputDescription.value = this.descrition;

        // expanding a card
        const toggleButton = this.shadowRoot.querySelector('.expand-card');
        toggleButton.addEventListener('click', e => {
            this.toggleCard();
        });

        //removing a card
        const removeButton = this.shadowRoot.querySelector('.remove-card');
        removeButton.addEventListener('click', (e) => {
            let event = new CustomEvent("CardRemoved", {
                detail: {
                    cardId: this.id
                },
                bubbles: true
                });
            this.dispatchEvent(event); 
        });

        //edit a card
        const editButton = this.shadowRoot.querySelector('.edit-card');
        editButton.addEventListener('click', (e) => {
            this.onClickEditButton();
        });

        //modifying a card
        const saveButton = this.shadowRoot.querySelector('.save-card');
        saveButton.addEventListener('click', (e) => {
            let title = this.shadowRoot.querySelector('.card-title-modify').value;
            let desc = this.shadowRoot.querySelector('.card-desc-modify').value;
            let event = new CustomEvent("CardModified", {
                detail: {
                    id: this.id,
                    title: title,
                    description: desc
                },
                bubbles: true
            })
            this.dispatchEvent(event);
        });
    }

    toggleCard() {
        let cardElement = this.shadowRoot.querySelector('.card');
        cardElement.classList.toggle('close');
    }

    onClickEditButton() {
        let cardElement  = this.shadowRoot.querySelector('.card');
        let titleElement = this.shadowRoot.querySelector('.card-title-modify');
        let descElement = this.shadowRoot.querySelector('.card-desc-modify');
        if(!cardElement.classList.contains('edit')) {
            cardElement.classList.add('edit');
            titleElement.disabled = false;
            descElement.disabled= false;
        }
    }
}


customElements.define('app-card', Card);