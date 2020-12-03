import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { TasksService } from 'src/app/core/classes/tasks.service';
import { OverlayService } from 'src/app/core/services/overlay.service';

@Component({
  selector: 'app-task-save',
  templateUrl: './task-save.page.html',
  styleUrls: ['./task-save.page.scss'],
})
export class TaskSavePage implements OnInit {

  public taskForm:FormGroup;

  constructor(
    private fb:FormBuilder, 
    private tasksService:TasksService,
    private navCtrl:NavController,
    private overlayService:OverlayService
  ) { }

  ngOnInit():void {
    this.createForm();
  }

  private createForm():void{
    this.taskForm = this.fb.group({
      title:['', [Validators.required, Validators.minLength(3)]],
      done:[false]
    });

  }

  public async onSubmit():Promise<void>{
    const loading = await this.overlayService.loading({
      message:"Saving..."
    });

    try{
      const task = await this.tasksService.create(this.taskForm.value);
      this.navCtrl.navigateBack('/tasks');
    }catch(error){
      this.overlayService.toast({message:error.message})
    }finally{
      loading.dismiss();
    }
  }

}
