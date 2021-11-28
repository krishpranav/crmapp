const {
    Record,
    StoreOf,
    Component,
    ListOf,
} = window.Torus;

const DATA_ORIGIN = '/data';

const PAGIATE_BY = 100;

const TODAY_ISO = (new Date()).toISOString().slice(0, 10);

const debounce = (fn, delayMillis) => {
    let lastRun = 0;
    let to = null;
    return (...args) => {
        clearTimeout(to);
        const now = Date.now();
        const dfn = () => {
            lastRun = now;
            fn(...args);
        }
        if (now - lastRun > delayMillis) {
            dfn()
        } else {
            to = setTimeout(dfn, delayMillis);
        }
    }
}

const isInputNode = node => {
    return ['input', 'textarea'].includes(node.tagName.toLowerCase());
}

class Contact extends Record {

    singleProperties() {
        return [
            ['name', 'name', 'name'],
            ['place', 'place', 'place'],
            ['work', 'work', 'work'],
            ['twttr', 'twttr', '@username'],
            ['last', 'last', 'last met...'],
            ['notes', 'notes', 'notes', true],
        ];
    }

    multiProperties() {
        return [
            ['tel', 'tel', 'tel'],
            ['email', 'email', 'email'],
            ['mtg', 'mtg', 'meeting', true],
        ]
    }

}

class ContactStore extends StoreOf(Contact) {

    init(...args) {
        this.super.init(...args);
    }

    get comparator() {
        return contact => {
            if (contact.get('name') === '?') {
                return -Infinity;
            }

            const last = contact.get('last');
            if (!last) {
                return 0;
            }

            const lastDate = new Date(last);
            return -lastDate.getTime();
        }
    }

    async fetch() {
        const data = await fetch(DATA_ORIGIN).then(resp => resp.json());
        if (!Array.isArray(data)) {
            throw new Error(`Expected data to be an array, got ${data}`);
        }

        this.reset(data.map(rec => new this.recordClass({
            ...rec,
            id: rec.id,
        })));
    }

    async persist() {
        return fetch(DATA_ORIGIN, {
            method: 'POST',
            body: JSON.stringify(this.serialize()),
        });
    }

}

class ContactItem extends Componenet {
    /* in the next video */
}