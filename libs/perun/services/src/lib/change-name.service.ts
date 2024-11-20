import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChangeNameService {
  private nameChangeSubject = new BehaviorSubject(false);
  private nameChange = this.nameChangeSubject.asObservable();

  changeName(): void {
    this.nameChangeSubject.next(true);
  }

  getNameChange(): Observable<boolean> {
    return this.nameChange;
  }
}
