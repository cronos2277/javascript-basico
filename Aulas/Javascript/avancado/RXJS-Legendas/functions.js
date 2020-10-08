const fs = require('fs');
const path = require('path');
const { Observable } = require('rxjs');

function createPipeableOperator(callback){
    return function(source){ 
        return Observable.create(
            subs => {   
                const sub = callback(subs);
                source.subscribe({
                    next:sub.next || (value => subs.next(value)),
                    error:sub.error || (error => subs.error(error)),
                    complete:sub.complete || (() => subs.complete())
                });       
                
            }
        );        
    }
}

function readDir(folderName){
    return new Observable(subscriber =>{
        try{
            
            const tmp = fs.readdirSync(`${folderName}`);            
            tmp.map(file => subscriber.next(path.join(__dirname,folderName,file)));       
            subscriber.complete();
        }catch(error){
            subscriber.error(error);
        }
    });    
}

function readFile(path){
    return new Observable(subscriber => {
        try{
            const content = fs.readFileSync(path,{encoding:'utf-8'});            
            subscriber.next(content.toString());
        }catch(error){
            subscriber.error(error);
        }
    });
}

const countElements = elements => Object.values(elements.reduce(
    (accumulator,element) => {
        const e = element.toLowerCase();
        const q = (accumulator[e])?accumulator[e].q+1:1;  
        accumulator[e] = {e,q};
        return accumulator;
    },
{}));

const regexSymbols =  /[\d|\r|\-|\?|\-|\,|\"|_|♪|%|\[|\]|\(|\)|\{|\}|\!|\.]/igm;
const regexTag = tag => new RegExp(`\<\/?${tag}\>`,"igm");
const removeChars = arr => arr.map(element => element.split(regexSymbols).join(''));
const removeTag = name => arr => arr.map(element => element.split(regexTag(name+'.*')).join(''));
const filterBy = pattern => createPipeableOperator(
    subscription => ({
            next(text){
                if(text.endsWith(pattern)){
                    subscription.next(text)
                }
            }
        })
);



const readFiles = paths => Promise.all(paths.map(path => readFile(path)));
const joinArrayInString = arr => arr.join('\n');
const splitAll = str => str.split('\n');
const removeEmpty = arr => arr.filter(a => !!a.trim());
const removeByPattern = pattern => arr => arr.filter(e => !e.includes(pattern));
const removeNumberLine = arr => arr.filter(e => isNaN(parseInt(e)));
const byWord = arr => arr.join(' ').split(' ');

const ordering = attr => arr => arr.sort((o1,o2) => o2[attr] - o1[attr]);

module.exports = {readDir,removeChars,removeTag,filterBy,readFile,readFiles,joinArrayInString,splitAll,removeEmpty,removeByPattern,removeNumberLine,byWord,countElements,ordering};