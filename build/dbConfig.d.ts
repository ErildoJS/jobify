/// <reference types="./vendor-typings/sqlite3" />
import sqlite3 from 'sqlite3';
export declare function openDb(): Promise<import("sqlite").Database<sqlite3.Database, sqlite3.Statement>>;
