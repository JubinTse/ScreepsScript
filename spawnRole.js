module.exports = {
    run: function () {

        /**
         * 统计各种角色数量
         */
        var temporaryHarvesters1 = _.filter(Game.creeps, (creep) => creep.memory.role == 'temporaryHarvester1');
        var temporaryHarvesters2 = _.filter(Game.creeps, (creep) => creep.memory.role == 'temporaryHarvester2');
        var temporaryWorkers = _.filter(Game.creeps, (creep) => creep.memory.role == 'temporaryWorker');
        var harvesters1 = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester1');
        var harvesters2 = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester2');
        var workers = _.filter(Game.creeps, (creep) => creep.memory.role == 'worker');
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var repairmen = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairman');
        var outTransfer = _.filter(Game.creeps, (creep) => creep.memory.role == 'outTransfer');
        var inTransfer = _.filter(Game.creeps, (creep) => creep.memory.role == 'inTransfer');
        var swordsmen = _.filter(Game.creeps, (creep) => creep.memory.role == 'swordsman');
        var total = harvesters1.length + harvesters2.length + workers.length + builders.length + upgraders.length + repairmen.length + outTransfer.length + inTransfer.length + swordsmen.length

        var ticksToLiveAverage = 0;

        for (var name in Game.creeps) {
            var creep = Game.creeps[name];
            if (!creep.spawning) {
                ticksToLiveAverage += creep.ticksToLive;
            }
        }
        console.log('全员平均寿命：' + parseFloat(ticksToLiveAverage / total));
        console.log('临时工：' + (temporaryHarvesters1.length + temporaryHarvesters2.length + temporaryWorkers.length) + '人');
        console.log('矿工：' + (harvesters1.length + harvesters2.length) + '人');
        console.log('工人：' + (workers.length + builders.length + upgraders.length + repairmen.length) + '人');
        console.log('搬运工：' + (outTransfer.length + inTransfer.length) + '人');
        console.log('剑士：' + swordsmen.length + '人');

        /**
         * 根据不同角色数量限制生产新的creep
         */
        if (harvesters1.length + harvesters2.length < 2) {
            var newName = 'harvester' + Game.time;
            Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, MOVE], newName, { memory: { role: 'harvester1' } });
        }

        if (total < 1 &&
            temporaryHarvesters1.length + temporaryHarvesters2.length + temporaryWorkers.length < 8
        ) {
            var newName = 'temporaryer' + Game.time;
            Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, CARRY, MOVE, MOVE], newName, { memory: { role: 'temporaryHarvester1' } });
        }

        if (harvesters1.length + harvesters2.length != 0) {
            for (var temporaryHarvester in temporaryHarvesters1) {
                temporaryHarvesters1[temporaryHarvester].suicide();
            }
            for (var temporaryHarvester in temporaryHarvesters2) {
                temporaryHarvesters2[temporaryHarvester].suicide();
            }
        }

        if ((outTransfer.length + inTransfer.length) < 4) {
            var newName = 'transfer' + Game.time;
            Game.spawns['Spawn1'].spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], newName, { memory: { role: 'outTransfer' } });
        }

        if ((workers.length + builders.length + upgraders.length + repairmen.length) < 6) {
            var newName = 'worker' + Game.time;
            Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE], newName, { memory: { role: 'worker' } });
        }

        if (swordsmen.length < 3) {
            var newName = 'swordsman' + Game.time;
            Game.spawns['Spawn1'].spawnCreep([TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE], newName, { memory: { role: 'swordsman' } });
        }
    }
}