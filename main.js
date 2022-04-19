var harvesterRole = require('harvesterRole');
var temporaryerRole = require('temporaryerRole');
var transferRole = require('transferRole');
var workerRole = require('workerRole');
var spawnRole = require('spawnRole');
const swordsmanRole = require('swordsmanRole');
const towerRole = require('./towerRole');

module.exports.loop = function () {
    
    console.log('----------------------------');

    // 释放内存
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    //生产creep
    spawnRole.run();
    towerRole.run();

    for (var name in Game.creeps) {

        var creep = Game.creeps[name];


        /**
         *  creep死亡前提前补员 
         */
        if (creep.ticksToLive < 50) {
            console.log(creep.memory.role + '即将死亡');
            var creepType = creep.memory.role;
            switch (creepType) {
                case 'harvester1':
                case 'harvester2':
                    if ((_.filter(Game.creeps, (creep) => creep.memory.role == 'harvester1').length +
                        _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester2').length
                    ) < 3) {
                        var newName = 'harvester' + Game.time;
                        Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, MOVE], newName, { memory: { role: 'harvester1' } });
                    }
                    break;
                case 'worker':
                case 'builder':
                case 'upgrader':
                case 'repairman':
                    if ((_.filter(Game.creeps, (creep) => creep.memory.role == 'worker').length +
                        _.filter(Game.creeps, (creep) => creep.memory.role == 'builder').length +
                        _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader').length +
                        _.filter(Game.creeps, (creep) => creep.memory.role == 'repairman').length
                    ) < 3) {
                        var newName = 'worker' + Game.time;
                        Game.spawns['Spawn1'].spawnCreep([
                            WORK, WORK, WORK,
                            CARRY, CARRY, CARRY,
                            MOVE, MOVE, MOVE
                        ], newName, { memory: { role: 'worker' } });
                    }
                    break;
                case 'inTransfer':
                case 'outTransfer':
                    if ((_.filter(Game.creeps, (creep) => creep.memory.role == 'inTransfer').length +
                        _.filter(Game.creeps, (creep) => creep.memory.role == 'outTransfer').length
                    ) < 5) {
                        var newName = 'transfer' + Game.time;
                        Game.spawns['Spawn1'].spawnCreep([
                            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
                        ], newName, { memory: { role: 'outTransfer' } });
                    }
                    break;
                case 'swordsman':
                    if ((_.filter(Game.creeps, (creep) => creep.memory.role == 'swordsman').length) < 2) {
                        var newName = 'swordsman' + Game.time;
                        Game.spawns['Spawn1'].spawnCreep([
                            TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
                            ATTACK, ATTACK, ATTACK,
                            MOVE, MOVE, MOVE
                        ], newName, { memory: { role: 'swordsman' } });
                    }
                    break;
                default:
                    console.log('即将死亡的creep为无业游民');
            }
        }

        switch (creep.memory.role) {
            case 'temporaryHarvester1':
            case 'temporaryHarvester2':
            case 'temporaryWorker':
                temporaryerRole.run(creep);
                break;
            case 'harvester1':
            case 'harvester2':
                harvesterRole.run(creep);
                break;
            case 'inTransfer':
            case 'outTransfer':
                transferRole.run(creep);
                break;
            case 'worker':
            case 'builder':
            case 'upgrader':
            case 'repairman':
                workerRole.run(creep);
                break;
            case 'swordsman':
                swordsmanRole.run(creep);
                break;
            default:
        }
    }

    console.log('----------------------------');

}