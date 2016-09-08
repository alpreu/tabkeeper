function shortcutPressed(command) {
    if (command == "savequit") {
        browser.tabs.query({}, storeTabInformation);
    }
}

function storeTabInformation(tabs) {
    let tabInformation = getTabInformation(tabs);
    browser.storage.local.set({storedTabs: tabInformation}, onTabsStored);
}

function getTabInformation(tabs) {
    var tabInformation = [];
    for (let tab of tabs) {
        var information = {url: tab.url, active: tab.active, index: tab.index};
        tabInformation.push(information);
    }
    return tabInformation;
}

function onTabsStored() {
    if (browser.runtime.lastError) {
        console.log(browser.runtime.lastError);
    } else {
        browser.notifications.create({
            "type": "basic",
            "iconUrl": "icons/tabkeeper.svg",
            "title": "TabKeeper Info",
            "message": "TabKeeper saved your tabs, Press ⌘+Q to quit."
        });
    }
}

function retrieveTabs() {
    browser.storage.local.get("storedTabs", onTabRetrieve);
}

function onTabRetrieve(item) {
    if (browser.runtime.lastError) {
        console.log(browser.runtime.lastError);
    } else {
        if(!Object.keys(item).length == 0) {
            openTabs(item.storedTabs);
        }
    }
}

function openTabs(storedTabs) {
    for (let tabProperties of storedTabs) {
        browser.tabs.create(tabProperties);
    }
    emptyLocalStorage();

}

function emptyLocalStorage() {
    browser.storage.local.remove("storedTabs", onLocalStorageEmpty);
}

function onLocalStorageEmpty() {
    if (browser.runtime.lastError) {
        console.log(browser.runtime.lastError);
    }
}

browser.commands.onCommand.addListener(shortcutPressed);
retrieveTabs();
