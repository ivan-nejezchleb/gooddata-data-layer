import isEqual = require('lodash/isEqual');
import identity = require('lodash/identity');

import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/switchMap';
import { AFM } from '@gooddata/typings';

import { IAdapter } from './interfaces/Adapter';
import { IDataSource } from './interfaces/DataSource';
import { isAfmExecutable } from './utils/AfmUtils';

export type IDataSubscriber = (data: any) => void;
export type IErrorSubscriber = (error: any) => void;

export class DataTable<T> {
    private adapter: IAdapter<T>;

    private dataSubscribers: IDataSubscriber[] = [];
    private errorSubscribers: IErrorSubscriber[] = [];

    private afm: AFM.IAfm;

    private dataSource: IDataSource<T>;

    private subject: Subject<Promise<T>>;
    private subscription: Subscription;

    constructor(adapter: IAdapter<T>) {
        this.adapter = adapter;

        this.subject = new Subject<Promise<T>>();
        this.subscription = this.subject
            .switchMap<Promise<T>, T>(identity)
            .subscribe(
                result => this.dataSubscribers.forEach(handler => handler(result)),
                error => this.errorSubscribers.forEach(handler => handler(error))
            );
    }

    public getData(afm: AFM.IAfm, resultSpec: AFM.IResultSpec) {
        if (!isAfmExecutable(afm)) {
            return;
        }

        if (!isEqual(afm, this.afm)) {
            this.afm = afm;
            this.adapter.createDataSource(afm)
                .then((dataSource) => {
                    this.dataSource = dataSource;
                    this.fetchData(resultSpec);
                }, (error) => {
                    this.errorSubscribers.forEach(handler => handler(error));
                });
        } else if (this.dataSource) {
            this.fetchData(resultSpec);
        }
    }

    public onData(callback: IDataSubscriber) {
        this.dataSubscribers.push(callback);
        return this;
    }

    public onError(callback: IDataSubscriber) {
        this.errorSubscribers.push(callback);
        return this;
    }

    public resetDataSubscribers() {
        this.dataSubscribers = [];
        return this;
    }

    public resetErrorSubscribers() {
        this.errorSubscribers = [];
        return this;
    }

    private fetchData(resultSpec: AFM.IResultSpec) {
        this.subject.next(this.dataSource.getData(resultSpec));
    }
}
