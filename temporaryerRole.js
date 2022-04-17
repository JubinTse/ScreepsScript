module.exports = {
    run: function (creep) {
        /**
         * 统计地图资源
         * sources            地图物资
         * resources          地上掉落的资源
         * targets            待建建筑
         * needToRepairs      需要维修的建筑（生命值已老化或被攻击至一半以下）
         * inStorages         存放资源的仓库
         * resourceStorages   存放资源的仓库
         * sources1Harvesters 资源点1号工作人数
         */
        var sources = creep.room.find(FIND_SOURCES);
        var targets = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
        var resources = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
        var inStorages = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (
                    (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                );
            },
        });
        var resourceStorages = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (
                    structure.structureType == STRUCTURE_CONTAINER &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                );
            },
        });
        var sources1Harvesters = _.filter(creep.room.lookAtArea(sources[0].pos.y - 2, sources[0].pos.x - 2, sources[0].pos.y + 2, sources[0].pos.x + 2, true), (s) => s.type == 'creep');

        /**
         * 根据creep身上可用空间及地图资源数量分配角色
         */
        if (creep.store.getFreeCapacity() == creep.store.getCapacity()) {
            if (sources1Harvesters.length < 6 && creep.memory.role != 'temporaryHarvester2') {
                creep.memory.role = "temporaryHarvester1";
            } else {
                creep.memory.role = "temporaryHarvester2";
            }
        } else if (creep.store.getFreeCapacity() == 0) {
            creep.memory.role = "temporaryWorker";
        }

        /**
         * 不同角色的工作分配
         */
        if (creep.memory.role == "temporaryHarvester1") {
            if (resources) {
                if (creep.pickup(resources) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(resources);
                    creep.say("👷‍♀️临时揀貨");
                }
            } else {
                if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                    creep.say("⛏️臨時采礦");
                }
            }
        } else if (creep.memory.role == "temporaryHarvester2") {
            if (resources) {
                if (creep.pickup(resources) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(resources);
                    creep.say("👷‍♀️临时揀貨");
                }
            } else {
                if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[1]);
                    creep.say("⛏️臨時采礦");
                }
            }
        } else if (creep.memory.role == "temporaryWorker") {
            if (inStorages) {
                if (
                    creep.transfer(inStorages, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(inStorages);
                    creep.say("👷‍♀️臨時卸貨");
                }
            } else if (targets) {
                if (creep.build(targets) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets);
                    creep.say("🧑‍🏭臨時建造");
                }
            } else if (resourceStorages) {
                if (
                    creep.transfer(resourceStorages, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
                ) {
                    creep.moveTo(resourceStorages);
                    creep.say("👷‍♀️臨時卸貨");
                }
            } else {
                if (
                    creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE
                ) {
                    creep.moveTo(creep.room.controller);
                    creep.say("⬆️臨時升級");
                }
            }
        }
    },
};
