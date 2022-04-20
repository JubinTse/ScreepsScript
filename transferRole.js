module.exports = {
    run: function (creep) {
        /**
         * 统计地图资源
         * resources        地上掉落的资源
         * outStorages      仓库资源
         * inStorages       存放资源的仓库
         * resourceStorages 存放资源的仓库
         * ruins            身上有资源的尸体
         */
        var resources = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
            filter: (resource) => {
                return resource.energy > 300;
            }
        });
        var ruins = creep.pos.findClosestByRange(FIND_RUINS, {
            filter: (ruin) => {
                return ruin.store.energy != 0;
            }
        });
        var outStorages = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (
                    (structure.structureType == STRUCTURE_CONTAINER ||
                        structure.structureType == STRUCTURE_STORAGE) &&
                    structure.store[RESOURCE_ENERGY] != 0
                );
            },
        });
        var inStorages = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (
                    (structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER ||
                        structure.structureType == STRUCTURE_EXTENSION) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                );
            },
        });
        var resourceStorages = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (
                    (structure.structureType == STRUCTURE_CONTAINER ||
                        structure.structureType == STRUCTURE_STORAGE) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                );
            },
        });

        /**
         * 根据creep身上可用空间及地图资源数量分配角色
         */
        if (creep.store.getFreeCapacity() == creep.store.getCapacity()) {
            creep.memory.role = "outTransfer";
        } else if (creep.store.getFreeCapacity() == 0) {
            creep.memory.role = "inTransfer";
        }

        /**
         * 不同角色的工作分配
         */
        if (creep.memory.role == "outTransfer") {
            if (ruins) {
                if (creep.withdraw(ruins, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(ruins);
                    creep.say("👷‍♀️揀尸");
                }
            } else if (resources) {
                if (creep.pickup(resources) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(resources);
                    creep.say("👷‍♀️揀貨");
                }
            } else if (outStorages) {
                if (creep.withdraw(outStorages, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(outStorages);
                    creep.say("👷‍♀️拿貨");
                }
            }
        } else if (creep.memory.role == "inTransfer") {
            if (inStorages) {
                if (creep.transfer(inStorages, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(inStorages);
                    creep.say("👷‍♀️卸貨");
                }
            } else if (resourceStorages) {
                if (creep.transfer(resourceStorages, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(resourceStorages);
                    creep.say("👷‍♀️卸貨");
                }
            }
        }
    },
};
