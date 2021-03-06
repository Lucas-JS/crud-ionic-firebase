import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
/*import { resolve } from 'dns';
import { rejects } from 'assert';*/

/*
  Generated class for the ContactProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ContactProvider {
  private PATH = 'contacts/';

  constructor(private db: AngularFireDatabase) { }

  getAll(){
    return this.db.list(this.PATH)
      .snapshotChanges()
      .map(changes => {
        return changes.map(c => ({
          key: c.payload.key, ...c.payload.val()}));
      })
  }

  get(key: string){
    return this.db.object(this.PATH + key)
    .snapshotChanges()
    .map(c => {
      return {key: c.key, ...c.payload.val()};
    })
  }

  save(contact: any){
    return new Promise((resolve, reject) => {
      if(contact.key){
        // atualizando pela lista
        this.db.list(this.PATH)
          .update(contact.key, {name: contact.name, tel: contact.tel})
          .then(() => resolve())
          .catch((e) => reject(e));

        // atualizando pelo objeto
        /*this.db.object(this.PATH + contact.key)
          .update({name: contact.name, tel: contact.tel})
          .then(() => resolve())
          .catch((e) => reject(e));*/
      }else {
        this.db.list(this.PATH)
          .push( {name: contact.name, tel: contact.tel})
          .then(() => resolve());
      }
    })
  }

  remove(key: string){
    return this.db.list(this.PATH).remove(key);
  }

}
