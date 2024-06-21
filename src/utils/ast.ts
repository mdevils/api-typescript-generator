import {ClassMethod, ClassProperty} from '@babel/types';

export function makeProtected(entity: ClassProperty | ClassMethod) {
    entity.accessibility = 'protected';
    return entity;
}
