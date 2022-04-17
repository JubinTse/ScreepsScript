module.exports = {
    run: function (creep) {

        /**
         * 统计地图资源
         * resources        地上掉落的资源
         * targets          待建建筑
         * needToRepairs    需要维修的建筑（生命值已老化或被攻击至一半以下）
         * storages         存放资源的仓库
         */
        var resources = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
            filter: (resource) => {
                resource.energy < 300;
            }
        })
        var targets = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
        var storages = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER) &&
                    structure.store[RESOURCE_ENERGY] != 0
            }
        });

        /**
         * 根据creep身上可用空间及地图资源数量分配角色
         */
        if (creep.store.getFreeCapacity() == creep.store.getCapacity()) {
            creep.memory.role = 'worker';
        } else if (creep.store.getFreeCapacity() == 0) {
            if (targets) {
                creep.memory.role = 'builder';
            } else if (creep.memory.role != 'builder' && creep.memory.role != 'repairman') {
                creep.memory.role = 'upgrader';
            }
        }

        /**
         * 不同角色的工作分配
         */
        if (creep.memory.role == 'worker') {
            if (storages) {
                if (creep.withdraw(storages, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storages);
                    creep.say('👷‍♀️拿貨');
                }
            } else if (resources) {
                if (creep.pickup(resources) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(resources);
                }
            }

        } else if (creep.memory.role == 'builder') {
            if (creep.build(targets) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets);
                creep.say('🧑‍🏭建造');
            }
            if (!targets) {
                creep.memory.role = 'upgrader';
            }
        } else if (creep.memory.role == 'upgrader') {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
                creep.say('⬆️升級');
            }
        }
    }
}